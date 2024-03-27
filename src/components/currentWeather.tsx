import React, { useState } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { fetchWithL402 } from "@getalby/lightning-tools";

interface GeoLocationData {
    ip: string;
    continent_name: string;
    country_name: string;
    state_prov: string;
    city: string;
    latitude: string;
    longitude: string;
    isp: string;
    country_flag: string;
}

const placeholder_geo: GeoLocationData = {
    ip: '',
    continent_name: '',
    country_name: '',
    state_prov: '',
    city: '',
    latitude: '',
    longitude: '',
    isp: '',
    country_flag: '', // Default flag or a placeholder image URL
};

const IPGeolocation = () => {
    const [geoData, setGeoData] = useState<GeoLocationData | null>(placeholder_geo);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { register, handleSubmit, formState } = useForm();

    const fetchGeoLocation = async (ip: string) => {
        try {
            setIsLoading(true);
            const response = await fetchWithL402(`https://api.ipgeolocation.io/ipgeo?apiKey=YOUR_API_KEY&ip=${ip}`,
                {},
                { headerKey: "L402" });
            const data = await response.json();
            setGeoData({ ...data });
        } catch (err) {
            setError('Failed to fetch geolocation data');
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = (data: FieldValues) => {
        fetchGeoLocation(data.ipInput);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return geoData ? (
        <div className="bg-white text-gray-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-semibold mb-6">IP Geolocation</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
                <input
                    {...register("ipInput", { required: true, pattern: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/ })}
                    name="ipInput"
                    className="p-2 text-gray-700 border rounded shadow-inner mb-4 w-full"
                    placeholder="Enter IP address"
                />
                {formState.errors.ipInput && <p className="text-red-500">Valid IP address is required.</p>}
                <button type="submit" className="mx-auto block bg-blue-500 text-white p-2 rounded shadow w-full">
                    Get Geolocation
                </button>
            </form>
            <table className="w-full text-sm">
                <tbody>
                    <tr>
                        <td>IP Address:</td>
                        <td>{geoData.ip}</td>
                    </tr>
                    <tr>
                        <td>Continent:</td>
                        <td>{geoData.continent_name}</td>
                    </tr>
                    <tr>
                        <td>Country:</td>
                        <td><img src={geoData.country_flag} alt="Country flag" className="inline-block h-6 mr-2" />{geoData.country_name}</td>
                    </tr>
                    <tr>
                        <td>State/Province:</td>
                        <td>{geoData.state_prov}</td>
                    </tr>
                    <tr>
                        <td>City:</td>
                        <td>{geoData.city}</td>
                    </tr>
                    <tr>
                        <td>Latitude:</td>
                        <td>{geoData.latitude}</td>
                    </tr>
                    <tr>
                        <td>Longitude:</td>
                        <td>{geoData.longitude}</td>
                    </tr>
                    <tr>
                        <td>ISP:</td>
                        <td>{geoData.isp}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    ) : null;
};

export default IPGeolocation;
