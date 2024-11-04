import React, { useState, useEffect } from "react";
import Loader from "../components/loader/loader";
import citiesData from "../lib/countries.min.json";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { BASE_URL, fetchAndSignChallenge } from "../lib/utils";

interface LocationProps {
  token: {
    ownerAddress: string;
    contractAddress: string;
    chainId: number;
    tokenId: string;
    image_preview_url: string;
  };
}

export const Share: React.FC<LocationProps> = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [userMessage, setUserMessage] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(true);
  const [signatureData, setSignatureData] = useState<{
    challengeText: string | undefined;
    challengeSignature: string | undefined;
    challengeExpiry: number | undefined;
  }>({
    challengeText: undefined,
    challengeSignature: undefined,
    challengeExpiry: undefined
  });
  
  const countries: Record<string, string[]> = citiesData;

  useEffect(() => {

    const fetchLocation = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/city-location-token-owner/${token.ownerAddress}/${token.contractAddress}/${token.chainId}`
        );

        if (!res.ok) {
          console.error("Error fetching location:", res.statusText);
          return;
        }

        const locationData = await res.json();

        if (locationData.country && locationData.city) {
          setSelectedCountry(locationData.country);
          setSelectedCity(locationData.city);
          setUserMessage(locationData.optionalUserMessage ?? "");
          setEditMode(false);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();

  }, [token]);

  const saveLocation = async (country: string, city: string) => {
    try {
      let currentSignature = signatureData;

      currentSignature = await fetchAndSignChallenge();
      setSignatureData(currentSignature);

      const { challengeText, challengeSignature } = currentSignature;

      if (challengeSignature) {
        const response = await fetch(`${BASE_URL}/set-city-location-token-owner-erc-721`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-SmartCat-Auth": `${challengeText}:${challengeSignature}`,
          },
          body: JSON.stringify({
            contractAddress: token.contractAddress,
            chainId: token.chainId,
            country,
            city,
            tokenImageUrl: token.image_preview_url,
            tokenId: token.tokenId,
            optionalUserMessage: userMessage ?? "",
          }),
        });

        if (response.ok) {
          setEditMode(false);
        } else {
          console.error("Failed to save location");
        }
      }
    } catch (error) {
      console.error("Failed to save location:", error);
    }
  };

  return (
    <div>
      {token && (
        <div className="m-6">
          <h1 className="text-2xl font-bold mb-4">
            {editMode
              ? "Set your city location and an optional message, to be shared with the community."
              : "Your shared city location."}
          </h1>

          {editMode ? (
            <>
              <div className="mb-4">
                <Select onValueChange={(value) => setSelectedCountry(value)}>
                  <SelectTrigger className="w-full p-4">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="absolute z-10">
                    {Object.keys(countries).map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCountry && (
                <div className="mb-4">
                  <Select onValueChange={(value) => setSelectedCity(value)}>
                    <SelectTrigger className="w-full p-4">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent className="absolute z-10">
                      {countries[selectedCountry]?.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedCountry && selectedCity && (
                <>
                  <Input
                    className="mt-1 mb-2"
                    placeholder="Any additional details (optional)"
                    maxLength={128}
                    onChange={(e) => setUserMessage(e.target.value)}
                  />
                  <Button
                    className="my-3"
                    disabled={!selectedCity}
                    onClick={() => saveLocation(selectedCountry, selectedCity)}
                  >
                    Save
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
              <div className="mb-4">
                <Input value={selectedCountry} disabled />
              </div>
              <div className="mb-4">
                <Input value={selectedCity} disabled />
              </div>
              {userMessage && <Input value={userMessage} disabled />}

              <div className="my-3">
                <Button className="float-right" onClick={() => {
                  setEditMode(true)
                  setUserMessage("")
                  setSelectedCountry("")
                  setSelectedCity("")
                }}>
                  Update location
                </Button>
              </div>
            </>
          )}

          <Loader show={loading} />
        </div>
      )}
    </div>
  );
};
