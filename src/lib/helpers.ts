import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { authKey } from "./constants";

dayjs.extend(relativeTime);

export class helpers {
  // ===== Cookies =====
  static setAuthCookie(key: string, value: string): void {
    Cookies.set(key, value);
  }

  static getAuthCookie(key: string): string | undefined {
    return Cookies.get(key);
  }

  static removeAuthCookie(key: string): void {
    Cookies.remove(key);
  }

  static hasAuthToken(): string | undefined {
    return Cookies.get(authKey);
  }

  static decodeToken(token: string): any {
    return jwtDecode(token);
  }

  // ===== Dates =====
  static formatDate(date: string | Date, type = "DD MMM YYYY"): string {
    return dayjs(date).format(type);
  }

  static formatTime(date: string | Date): string {
    return dayjs(date).format("h:s A");
  }

  static formatDateTime(date: string | Date): string {
    return dayjs(date).format("h:s A - DD MMM YYYY");
  }
  static timeAgoDiff(date: string | Date): string {
    return dayjs(date).fromNow();
  }
  //  ===== localStorage  =====
  static getStorageItem = (key: string) => {
    return localStorage.getItem(key);
  };
  static setStorageItem = (key: string, value: string | any) => {
    return localStorage.setItem(key, value);
  };
  static removeStorageItem = (key: string) => {
    return localStorage.removeItem(key);
  };

  // ===== Strings =====
  static capitalize(text: string): string {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  static lowerCase(text: string): string {
    return text ? text.toLowerCase() : "";
  }

  static upperCase(text: string): string {
    return text ? text.toUpperCase() : "";
  }
  static randomString(): string {
    return crypto.randomUUID();
  }
  // ========= from data =============
  static fromData(values: Record<string, any>): FormData {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      const value = values[key];
      if (Array.isArray(value)) {
        if (value.every((v) => v instanceof File)) {
          value.forEach((file: File) => formData.append(key, file));
        } else {
          formData.append(key, JSON.stringify(value));
        }
      } else if (value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === "object" && value !== null) {
        formData.append(key, JSON.stringify(value));
      } else if (value === "array") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });
    return formData;
  }

  // ========= imgSource =============
  static imgSource(href: string): string {
    if (!href) return "";

    if (href.startsWith("http://") || href.startsWith("https://")) {
      return href;
    }

    const base = (
      process.env.NEXT_PUBLIC_IMG_URL || "https://api.findavibes.com/"
    ).replace(/\/+$/, "");
    const path = href.replace(/^\/+/, "");

    return `${base}/${path}`;
  }
}
