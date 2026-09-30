"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button, Label } from "@/components/ui";
import { useRef, useState, useEffect } from "react";
import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerEyeDropper,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerSelection,
} from "@/components/ui";
import { cn } from "@/lib";
import {
  Controller,
  ControllerRenderProps,
  ControllerFieldState,
  FieldValues,
  useFormContext,
} from "react-hook-form";

export default function FormColorPicker({
  label,
  defaultColor = "",
  stylelabel,
  name,
}: any) {
  const { control } = useFormContext();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [width, setWidth] = useState<number>(0);

  // Dynamically capture trigger button width
  useEffect(() => {
    if (buttonRef.current) {
      setWidth(buttonRef.current.offsetWidth);
    }

    const handleResize = () => {
      if (buttonRef.current) {
        setWidth(buttonRef.current.offsetWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultColor}
      render={({
        field,
        fieldState: { error },
      }: {
        field: ControllerRenderProps<FieldValues>;
        fieldState: ControllerFieldState;
      }) => (
        <div className="w-full relative h-12 flex justify-center items-center border rounded-[20px]">
          {label && (
            <Label
              className={cn(
                "text-secondery-figma text-base font-medium absolute -top-3 left-7 bg-blacks px-3",
                stylelabel
              )}
            >
              {label}
            </Label>
          )}

          <Popover>
            <PopoverTrigger asChild>
              <Button
                ref={buttonRef}
                variant="outline"
                className="w-[96%] mx-auto h-5 border rounded-sm"
                style={{ backgroundColor: field.value }}
              />
            </PopoverTrigger>

            <PopoverContent
              className="overflow-hidden bg-background"
              style={{ width }}
            >
              <ColorPicker
                defaultValue={field.value}
                onChange={(color) => field.onChange(color)}
                className="h-[300px] w-full"
              >
                <ColorPickerSelection />

                <div className="flex items-center gap-4">
                  <ColorPickerEyeDropper />
                  <div className="grid w-full gap-1">
                    <ColorPickerHue />
                    <ColorPickerAlpha />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ColorPickerFormat />
                </div>
              </ColorPicker>
            </PopoverContent>
          </Popover>

          {error && (
            <p className="text-red-500 text-sm absolute -bottom-5 left-3">
              {error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
