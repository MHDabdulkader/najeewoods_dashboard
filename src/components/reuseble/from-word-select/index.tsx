"use client";

import { useState, useEffect } from "react";
import { CircleAlert, X } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui";
import { useGetUserQuery } from "@/redux/api/userApi";
import { helpers } from "@/lib";
import Avatars from "../avater";

interface FormSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  stylelabel?: string;
  matching?: boolean;
  selectedUsers?: any;
  setSelectedUsers?: any;
}

export function InputWordSelectField({
  name,
  label,
  placeholder,
  stylelabel,
  className,
  matching = false,
  selectedUsers,
  setSelectedUsers,
}: FormSelectProps) {
  const { control, setValue } = useFormContext();
  const [inputValue, setInputValue] = useState("");

  // Fetch users dynamically when searching
  const { data: users, isLoading } = useGetUserQuery(
    { search: inputValue },
    { skip: !inputValue }
  );

  // 🧠 Sync selected user IDs into form field
  useEffect(() => {
    const ids = selectedUsers?.map((user:any) => user._id);
    setValue(name, ids);
  }, [selectedUsers, setValue, name]);

  // ✅ Add user if not already selected
  const handleAddUser = (user: any) => {
    setSelectedUsers((prev:any) => {
      const exists = prev.some((u:any) => u._id === user._id);
      return exists ? prev : [...prev, user];
    });
    setInputValue("");
  };

  // ✅ Remove selected user
  const handleRemoveUser = (userId: string) => {
    setSelectedUsers((prev:any) => prev.filter((u:any) => u._id !== userId));
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ fieldState: { error } }) => (
        <div className="relative">
          {/* Input Field */}
          <div className="mb-2 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholder || "Search user..."}
              className={cn(
                "w-full py-[22px] rounded-[20px] shadow-none pr-10",
                className
              )}
            />
          </div>

          {/* Dropdown Search Results */}
          {inputValue && !isLoading && users?.data?.length > 0 && (
            <div className="absolute z-20 bg-[#222] border w-full rounded-xl mt-1 p-2">
              <ScrollArea className="h-40 w-full">
                <div className="space-y-3 mr-3">
                  {users?.data?.map((user: any) => (
                    <div
                      key={user._id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddUser(user);
                      }}
                      className="flex items-center gap-3 p-1 cursor-pointer hover:bg-[#333] rounded-lg transition"
                    >
                      <Avatars
                        src={helpers.imgSource(user?.avatar?.url)}
                        fallback={user?.name}
                        alt="profile"
                        className="size-2"
                        fallbackStyle="bg-[#cb4ec9]/70 text-white"
                      />
                      <div>
                        <h1 className="font-medium">{user.name}</h1>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Selected Users */}
          {selectedUsers?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedUsers?.map((user:any) => (
                <div
                  key={user._id}
                  className="flex items-center gap-2 bg-[#3D3D3D] text-white px-3 py-1 rounded-full"
                >
                  <span className="text-sm">{user.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveUser(user._id)}
                    className="ml-1 text-white"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Label */}
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

          {/* Error Message */}
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
