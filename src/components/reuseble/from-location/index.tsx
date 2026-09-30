"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";
import { useState, useCallback, useEffect, useRef } from "react";
import { CircleAlert } from "lucide-react";

// Debounce function
const debounce = <F extends (...args: any[]) => any>(
  func: F,
  delay: number
) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<F>): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

// Fetching places from Google API
async function fetchGooglePlaces(value: string) {
  if (value?.length > 0) {
    const res = await fetch(`/api/google-place?query=${value}`);
    const data = await res.json();
    return data?.results;
  }
}

interface FormInputProps {
  stylelabel?: string;
  name?: string;
  label?: string;
  className?: string;
}

export default function FromLocation({
  name = "location",
  label,
  stylelabel,
  className,
}: FormInputProps) {
  const { control, setValue } = useFormContext();
  const [suggestions, setSuggestions] = useState<any[]>([]); // Store only one set of suggestions
  const suggestionsRef = useRef<HTMLUListElement | null>(null); // Reference to the suggestions box

  const handleSearch = useCallback(
    (query: string) => {
      const debouncedSearch = debounce(async (searchQuery: string) => {
        if (searchQuery) {
          const results = await fetchGooglePlaces(searchQuery);
          setSuggestions(results || []);
        } else {
          setSuggestions([]);
        }
      }, 500);

      debouncedSearch(query);
    },
    [] // Only create debounce function once
  );

  const handleSelectSuggestion = (suggestion: any) => {
    const locationData = {
      address: suggestion.formatted_address,
      coordinates: [
        suggestion.geometry.location.lng,
        suggestion.geometry.location.lat
      ],
      type: "Point",
    };

    // Set the location object directly in the form data
    setValue(name, locationData, { shouldValidate: true });
    setSuggestions([]); // Clear suggestions once a location is selected
  };

  const inputId = `input-${name}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]); // Hide the suggestions box when clicking outside
      }
    };

    // Add event listener on mount
    document.addEventListener("click", handleClickOutside);

    // Clean up event listener on unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full">
      <Controller
        name={name}
        control={control}
        rules={{ required: "Location is required" }}
        render={({ field, fieldState: { error } }) => (
          <>
            <Input
              {...field}
              placeholder="Location"
              className="flex-1 h-12 rounded-[20px]"
              // Display only the address in the input field
              value={field.value?.address ?? ""}
              onChange={(e) => {
                // Check if field.value is null or undefined, fallback to empty object
                const currentValue = field.value || {};
                setValue(
                  name,
                  { ...currentValue, address: e.target.value },
                  { shouldValidate: true }
                );
                handleSearch(e.target.value); // Call the search function on input change
              }}
              autoComplete="off"
              id={inputId}
            />
            {suggestions.length > 0 && (
              <ul
                ref={suggestionsRef} // Attach ref to suggestions box
                className="absolute z-10 w-full mt-1 scrollbar-hide bg-blacks text-foreground border rounded-md shadow-lg max-h-60 overflow-y-auto"
              >
                {suggestions.map((sug) => (
                  <li
                    key={sug.place_id}
                    className="p-3 text-sm cursor-pointer"
                    onClick={() => handleSelectSuggestion(sug)}
                  >
                    {sug.formatted_address}
                  </li>
                ))}
              </ul>
            )}
            {error?.message && (
              <h3 className="text-sm pt-[1px] text-end text-[#f73f4e] flex gap-1 items-center justify-end">
                {error.message}
                <CircleAlert size={14} />
              </h3>
            )}
          </>
        )}
      />
      <Label
        htmlFor={inputId}
        className={`text-secondery-figma text-base font-medium absolute -top-3 left-7 bg-blacks px-3 ${stylelabel}`}
      >
        {label ?? "Location"}
      </Label>
    </div>
  );
}
