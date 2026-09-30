"use client";
import { CircleAlert } from "lucide-react";
import {
  Controller,
  useFormContext,
  type FieldValues,
  type ControllerRenderProps,
  type ControllerFieldState,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FormSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  items: { label: string; value: string; icon?: any }[];
  defaultValue?: string;
  stylelabel?: string;
  matching?: boolean;
  className?: string;
  itemStyle?: string;
  iconStyle?: string;
}

export function InputSelectField({
  name,
  label,
  placeholder,
  items,
  stylelabel,
  matching = false,
  className,
  itemStyle,
  iconStyle,
}: FormSelectProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, value },
        fieldState: { error },
      }: {
        field: ControllerRenderProps<FieldValues>;
        fieldState: ControllerFieldState;
      }) => (
        <div className="relative">
          <Select onValueChange={onChange} value={value}>
            <SelectTrigger
              className={cn(
                "w-full  items-center rounded-[20px]   py-[22px] cursor-pointer shadow-none",
                className
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="rounded-md bg-blacks p-0">
              <SelectGroup className="p-0 m-0">
                {items?.map((item, index) => (
                  <SelectItem
                    className={cn(
                      "border-b last:border-b-0 cursor-pointer py-2 pl-4  text-white rounded-none",
                      itemStyle
                    )}
                    key={index}
                    value={item.value}
                  >
                    <span className="flex justify-center items-center">
                      {" "}
                      {item.icon && (
                        <span className={cn("mr-1", iconStyle)}>
                          {item.icon}
                        </span>
                      )}{" "}
                      {item.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {!matching && (
            <Label
              className={cn(
                "text-secondery-figma text-base font-medium absolute -top-3 left-7 bg-blacks px-3",
                stylelabel
              )}
            >
              {label}
            </Label>
          )}

          {error?.message && (
            <h3 className="text-sm pt-[1px] text-end text-[#f73f4e] flex gap-1 items-center justify-end">
              {error.message}
              <CircleAlert size={14} />
            </h3>
          )}
        </div>
      )}
    />
  );
}
