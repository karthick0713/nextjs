import React, { useEffect, useRef, useState } from 'react';
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Declare the google variable to avoid TypeScript errors
declare global {
  interface Window {
    google: typeof google;
  }
}

const loadGoogleMapsScript = (callback: () => void): void => {
  if (window.google && window.google.maps) {
    callback();
    return;
  }
  const existingScript = document.getElementById('googleMapsScript');
  if (!existingScript) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
    script.id = 'googleMapsScript';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    script.onload = () => {
      if (callback) callback();
    };
  }
  if (existingScript && callback) callback();
};

const GooglePlacesAutocomplete: React.FC = () => {
  const { control, setValue } = useFormContext();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const autoCompleteRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadGoogleMapsScript(() => {
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (isLoaded && autoCompleteRef.current && window.google && window.google.maps) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        autoCompleteRef.current,
        { types: ['address'], componentRestrictions: { country: 'us' } }
      );

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        fillInAddress(place);
      });
    }
  }, [isLoaded]);

  const fillInAddress = (place: google.maps.places.PlaceResult): void => {
    let address1 = '';
    let postcode = '';
    let city = '';
    let state = '';

    for (const component of place.address_components || []) {
      const componentType = component.types[0];

      switch (componentType) {
        case 'street_number':
          address1 = `${component.long_name} ${address1}`;
          break;
        case 'route':
          address1 += component.short_name;
          break;
        case 'postal_code':
          postcode = `${component.long_name}${postcode}`;
          break;
        case 'postal_code_suffix':
          postcode = `${postcode}-${component.long_name}`;
          break;
        case 'locality':
          city = component.long_name;
          break;
        case 'administrative_area_level_1':
          state = component.short_name;
          break;
      }
    }

    setValue('address.address_line1', address1);
    setValue('address.city', city);
    setValue('address.state', state);
    setValue('address.zipcode', postcode);
  };

  return (
    <FormField
      control={control}
      name="google_address"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Start typing your address</FormLabel>
          <FormControl>
            <Input
              {...field}
              ref={(e) => {
                field.ref(e);
                autoCompleteRef.current = e;
              }}
              placeholder={isLoaded ? "Start typing your address..." : "Loading..."}
              disabled={!isLoaded}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default GooglePlacesAutocomplete;