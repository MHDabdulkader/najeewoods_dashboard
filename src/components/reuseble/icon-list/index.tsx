import FavIcon from "@/icon/favIcon";
import { cn } from "@/lib";

type BtnProps = {
  onClick?: () => void;
  className?:string,
  iconStyle?:string
};

// Previewbtn
export function Previewbtn({ onClick,iconStyle }: BtnProps) {
  return (
    <button
      onClick={onClick}
      className="size-10 bg-transparent border-2 grid place-items-center  rounded-lg cursor-pointer"
    >
      <FavIcon name="eye" className={iconStyle} />
    </button>
  );
}

// Deletebtn
export function Deletebtn({ onClick,className,iconStyle }: BtnProps) {
  return (
    <button
      onClick={onClick}
      type="submit"
      className={cn(`size-10 bg-transparent border-2 grid place-items-center  rounded-lg cursor-pointer`,className)}
    >
      <FavIcon name="delete" className={iconStyle} />
    </button>
  );
}
// edit
export function Editbtn({ onClick,className,iconStyle }: BtnProps) {
  return (
    <button
      onClick={onClick}
      type="submit"
      className={cn(`size-10 bg-transparent border-2 grid place-items-center  rounded-lg cursor-pointer`,className)}
    >
      <FavIcon name="edit" className={iconStyle} />
    </button>
  );
}