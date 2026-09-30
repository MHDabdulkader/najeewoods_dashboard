import { z } from "zod";

export const supportSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z
    .string()
    .nonempty("Email is required")
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Invalid email address",
    }),
  // subject: z.string().nonempty("Subject is required"),
  message: z.string().nonempty("Message is required"),
});
export const moodSchema = z.object({
  name: z.string().nonempty("Mood name is required"),
  icon: z
    .any()
    .refine((file) => file instanceof File, { message: "Photo is required" }),
  color: z.string().optional(),
});

// /musicSchema
export const musicSchema = z.object({
  mood: z.string().nonempty("Vide is required"),
  location: z.any().refine((obj) => obj && Object.keys(obj).length > 0, {
    message: "Location is required",
  }),
  caption: z.string().nonempty("Caption is required"),
  privacy: z.string().nonempty("Visibility is required"),
  audio: z
    .array(z.any())
    .refine(
      (files) =>
        files.length >= 1 && files.every((file) => file instanceof File),
      { message: "Music is required" }
    ),
});
// podcastSchema
// export const podcastSchema = z.object({
//   mood: z.string().nonempty("Vide is required"),
//   location: z.any().refine((obj) => obj && Object.keys(obj).length > 0, {
//     message: "Location is required",
//   }),
//   private_circle: z.array(z.any()).refine((v) => v.length >= 1, { message: "Guest is required" }),
//   caption: z.string().nonempty("Caption is required"),
//   privacy: z.string().nonempty("Visibility is required"),
//   podcast: z
//     .array(z.any())
//     .refine(
//       (files) =>
//         files.length >= 1 && files.every((file) => file instanceof File),
//       { message: "Music is required" }
//     ),
// });

export const podcastSchema = z
  .object({
    mood: z.string().nonempty("Vibe is required"),
    location: z.any().refine((obj) => obj && Object.keys(obj).length > 0, {
      message: "Location is required",
    }),
    caption: z.string().nonempty("Caption is required"),
    privacy: z.string().nonempty("Visibility is required"),
    podcast: z
      .array(z.any())
      .refine(
        (files) =>
          files.length >= 1 && files.every((file) => file instanceof File),
        { message: "Music file is required" }
      ),
    private_circle: z.array(z.any()).optional(),
  })
  .superRefine((data, ctx) => {
    // If privacy = private_circle, then guests must be selected
    if (data.privacy === "private_circle") {
      if (!data.private_circle || data.private_circle.length === 0) {
        ctx.addIssue({
          path: ["private_circle"],
          message: "Private Circle is required",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

export const passwordChangeSchema = z
  .object({
    old_password: z.string().nonempty("Current Password is required"),
    new_password: z.string().nonempty("New Password is required"),
    c_password: z.string().nonempty("Confirm password is required"),
  })
  .refine((value) => value.new_password === value.c_password, {
    path: ["c_password"],
    message: "Passwords must be match.",
  });

// loginSchema
export const loginSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Invalid email address",
    }),
  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters long"),
});

// newPasswordSchema
export const newPasswordSchema = z
  .object({
    new_password: z
      .string()
      .nonempty("Password is required")
      .min(6, "Password must be at least 6 characters long"),
    c_password: z
      .string()
      .nonempty("Confirm Password is required")
      .min(6, "Password must be at least 6 characters long"),
  })
  .refine((value) => value.new_password === value.c_password, {
    path: ["c_password"],
    message: "Passwords must be match.",
  });
