import { useEffect, useState } from "react";
import { BASE_URL, previewAddr } from "../lib/utils";
import { Card } from "./../components/ui/card";
import citiesData from "../lib/countries.min.json";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";

const countries: Record<string, string[]> = citiesData;

interface TokenProps {
  ownerAddress: string;
  contractAddress: string;
  chainId: number;
  tokenId: string;
}

interface UserProps {
  ownerAddress: string;
  contractAddress: string;
  chainId: number;
  country: string;
  city: string;
  tokenId: string;
  tokenImageUrl: string;
  optionalUserMessage?: string;
  createdAt: string;
}

interface LocationProps {
  token: TokenProps;
}

export const Check: React.FC<LocationProps> = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [useManualAddressEntry, setUseManualAddressEntry] = useState(false);

  useEffect(() => {
    if (token.tokenId) {
      const fetchUsersInLocation = async () => {
        setLoading(true);
        setError(null);

        try {
          const resUserLocation = await fetch(
            `${BASE_URL}/city-location-token-owner/${token.ownerAddress}/${token.contractAddress}/${token.chainId}`
          );

          if (!resUserLocation.ok) {
            throw new Error(`Error fetching location: ${resUserLocation.statusText}`);
          }

          const userLocationData = await resUserLocation.json();
          setSelectedCountry(userLocationData.country);
          setSelectedCity(userLocationData.city);

          const resUsersFound = await fetch(
            `${BASE_URL}/city-location-token-owners/${token.contractAddress}/${token.chainId}/${userLocationData.city}/${userLocationData.country}`
          );

          if (!resUsersFound.ok) {
            throw new Error(`Error fetching users: ${resUsersFound.statusText}`);
          }

          const usersFound = await resUsersFound.json();
          const sortedUsers = usersFound.sort((a: UserProps, b: UserProps) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setUsers(sortedUsers);

        } catch (error) {
          console.error("Error:", error);
          setError("Failed to fetch data. Please try again later.");
        } finally {
          setLoading(false);
        }
      };

      fetchUsersInLocation();
    } else {
      setUseManualAddressEntry(true);
      setLoading(false);
    }
  }, [token]);

  const fetchUsersInManualLocation = async (city: string, country: string) => {
    try {
      const resUsersFound = await fetch(
        `${BASE_URL}/city-location-token-owners/${token.contractAddress}/${token.chainId}/${city}/${country}`
      );

      if (!resUsersFound.ok) {
        throw new Error(`Error fetching users: ${resUsersFound.statusText}`);
      }

      const usersFound = await resUsersFound.json();
      const sortedUsers = usersFound.sort((a: UserProps, b: UserProps) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setUsers(sortedUsers);
      
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to fetch data. Please try again later.");
    }

    setUseManualAddressEntry(false);
    
  };

  return (
    <div>
      {loading ? (
        <Card className="m-6 p-4 space-y-3 shadow-lg rounded-lg border border-gray-200 bg-white">
          Loading...
        </Card>
      ) : error ? (
        <Card className="m-6 p-4 space-y-3 shadow-lg rounded-lg border border-gray-200 bg-white">
          {error}
        </Card>
      ) : useManualAddressEntry && !users.length ? (
        <div className="m-6">
          <p className="my-6">
            Fans of the Souls Galaxy collection: even if you don't hold a token, you can still enter your location to find others nearby.
          </p>
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
            <Button
              className="my-3"
              disabled={!selectedCity}
              onClick={() => fetchUsersInManualLocation(selectedCity, selectedCountry)}
            >
              Search
            </Button>
          )}
        </div>
      ) : (
        <div>
          <div className="m-6">
            Users found in <b>{selectedCity}, {selectedCountry}</b>.
          </div>
          {users.map((user) => (
            <Card key={user.ownerAddress} className="m-6 p-4 space-y-3 shadow-lg rounded-lg border border-gray-200 bg-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-800 font-semibold">
                  #{previewAddr(user.tokenId)}
                  {user.ownerAddress.toLowerCase() === token.ownerAddress.toLowerCase() && (
                    <span className="ml-1 text-gray-400">(You)</span>
                  )}
                </p>
                <p className="text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <img
                  className="w-12 h-12 rounded-full border border-gray-300"
                  src={user.tokenImageUrl}
                  alt="User token image"
                />
                {user.optionalUserMessage && (
                  <p className="text-sm ml-4 text-gray-700 italic">{user.optionalUserMessage}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
