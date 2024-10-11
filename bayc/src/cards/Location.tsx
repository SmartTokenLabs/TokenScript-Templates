import React, { useState, useEffect } from "react";
import Loader from "../components/loader/loader";
import citiesData from "../lib/countries.min.json";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "./../components/ui/select";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { fetchAndSignChallenge } from "../lib/utils";

interface LocationProps {
  token: any;
}

// /city-location/set-city-location-token-owner-erc-721/:signature/:contractAddress/:chainId/:country/:city/:tokenImageUrl/:tokenId",
// /city-location/set-city-location-token-owner-erc-721/:signature/:contractAddress/:chainId/:country/:city/:tokenImageUrl/:tokenId",
// /city-location/city-location-token-owners/:contractAddress/:chainId/:city/:country",

const BASE_URL = "http://127.0.0.1:3006/city-location";

export const Location: React.FC<LocationProps> = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [userMessage, setUserMessage] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(true);

  const countries: Record<string, string[]> = citiesData;

  useEffect(() => {
    setLoading(false);
  }, []);

  const saveLocation = async (country: string, city: string) => {

    const userSignature = await fetchAndSignChallenge();
    
    if(token && token.contractAddress && token.tokenId && token.chainId && userSignature) {

      fetch(`${BASE_URL}/set-city-location-token-owner-erc-721/${userSignature}/${token.contractAddress}/${token.chainId}/${country}/${city}/${encodeURIComponent(token.image_preview_url)}/${token.tokenId}/${encodeURIComponent(userMessage)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          country,
          city,
        }),
      }).then((response) => {

        if (response.ok) {
          console.log("Location saved successfully");
          setEditMode(false);

          setTimeout(() => {
            window.close();
          }, 3000);

        } else {
          console.log("Failed to save location");
        }

      }, (error) => {
        
        console.log("Failed to save location", error);

      })

    }
    
  }

  return (
    <div className="p-5">
      {token && editMode && (
        <div className="m-4">
          <h1 className="text-2xl font-bold mb-4">Set your city location and an optional message, to be shared to BAYC holders.</h1>
          <div className="mb-4">
            <Select onValueChange={(value) => setSelectedCountry(value)}>
				      <SelectTrigger className="w-full p-4">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="absolute z-10">
                {Object.keys(countries).map((country: string) => (
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
                  {countries[selectedCountry]?.map((city: string) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )} 
          {selectedCountry && selectedCity && (
            <Input className="mt-1 mb-2" placeholder="Any additional details (optional)" maxLength={128} onChange={(e) => setUserMessage(e.target.value)} />
          )}
          {selectedCountry && selectedCity && (
            <Button
            className="my-1"
            disabled={!selectedCity}
            onClick={() => {
              saveLocation(selectedCountry, selectedCity);
            }}>Save</Button>
          )}
        </div>
      )}
      {token && !editMode && (
        <div className="m-4">
          <h1 className="text-2xl font-bold mb-4">Your shared city location with BAYC holders.</h1>
          <div className="mb-4">
            <Input value={selectedCountry} disabled className="disabled:opacity-1" />
          </div>

          {selectedCountry && (
            <div className="mb-4">
              <Select disabled>
			  	    <Input value={selectedCity} disabled className="disabled:opacity-1" />
              </Select>
            </div>
          )} 

          {userMessage && (
            <Input value={userMessage} disabled className="disabled:opacity-1" />
          )}

          <div className="my-1">
            <Button
              className="float-right"
              disabled={!selectedCity}
            onClick={() => {
              setEditMode(true);
            }}>Edit</Button>
          </div>
        </div>
      )}
      <Loader show={loading} />
    </div>
  );
};
