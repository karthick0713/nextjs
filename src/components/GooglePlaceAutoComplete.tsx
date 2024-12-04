import React, { useEffect, useRef, useState } from 'react';
import { Control, UseFormSetValue } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

// Declare the window type for Google Maps
declare global {
  interface Window {
    google: typeof google;
    initAutocomplete: () => void;
  }
}

interface GooglePlacesAutocompleteProps {
  control: Control<any>;
  setValue: UseFormSetValue<any>;
}

export function GooglePlacesAutoComplete({ control, setValue }: GooglePlacesAutocompleteProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Check if script is already loaded
    if (window.google?.maps?.places) {
      setIsScriptLoaded(true);
      initAutocomplete();
      return;
    }

    const googleMapScript = document.createElement('script');
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      setError('Google Maps API key is missing');
      return;
    }

    // Add script with callback
    window.initAutocomplete = () => {
      setIsScriptLoaded(true);
      initAutocomplete();
    };

    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initAutocomplete`;
    googleMapScript.async = true;
    googleMapScript.defer = true;
    googleMapScript.onerror = () => {
      setError('Failed to load Google Maps script');
      setIsLoading(false);
    };

    document.head.appendChild(googleMapScript);

    return () => {
      // Cleanup
      if (autoCompleteRef.current) {
        google.maps.event.clearInstanceListeners(autoCompleteRef.current);
      }
      window.initAutocomplete = () => {};
    };
  }, []);

  const initAutocomplete = () => {
    if (!inputRef.current) return;

    try {
      autoCompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'us' },
        fields: ['address_components', 'formatted_address'],
        types: ['address']
      });

      autoCompleteRef.current.addListener('place_changed', handlePlaceSelect);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to initialize Google Places Autocomplete');
      setIsLoading(false);
    }
  };

  const handlePlaceSelect = () => {
    try {
      const place = autoCompleteRef.current?.getPlace();
      if (!place?.address_components) {
        throw new Error('Invalid address selected');
      }

      let addressComponents = {
        streetNumber: '',
        route: '',
        city: '',
        county: '',
        state: '',
        postalCode: ''
      };

      // Extract address components
      place.address_components.forEach(component => {
        const types = component.types;

        if (types.includes('street_number')) {
          addressComponents.streetNumber = component.long_name;
        }
        if (types.includes('route')) {
          addressComponents.route = component.long_name;
        }
        if (types.includes('locality')) {
          addressComponents.city = component.long_name;
        }
        if (types.includes('administrative_area_level_2')) {
          addressComponents.county = component.long_name.replace(' County', '');
        }
        if (types.includes('administrative_area_level_1')) {
          addressComponents.state = component.short_name;
        }
        if (types.includes('postal_code')) {
          addressComponents.postalCode = component.long_name;
        }
      });

      // Update form values
      setValue('google_address', place.formatted_address, { shouldValidate: true });
      setValue('address.address_line1', 
        `${addressComponents.streetNumber} ${addressComponents.route}`.trim(), 
        { shouldValidate: true }
      );
      setValue('address.city', addressComponents.city, { shouldValidate: true });
      setValue('address.county', addressComponents.county, { shouldValidate: true });
      setValue('address.state', addressComponents.state, { shouldValidate: true });
      setValue('address.zipcode', addressComponents.postalCode, { shouldValidate: true });

    } catch (err) {
      setError('Failed to process selected address');
    }
  };

  return (
    <div>
      <Input
        ref={inputRef}
        type="text"
        placeholder={isLoading ? "Loading..." : "Start typing your address..."}
        disabled={isLoading || !!error}
        className={error ? 'border-red-500' : ''}
      />
      {error && <div className="text-sm text-red-500 mt-1">{error}</div>}
    </div>
  );
}