import assets from "@/assets";
import { ImgBox } from "@/components/reuseble/img-box";

export const dummyJson = {
  meta: {
    current_page: 1,
    per_page: 10,
    total: 20,
  },
};

//  vibeOptions
export const vibeOptions = [
  {
    label: "Chill",
    value: "60d5f9b9e9c72f001f5c8f6f",
    icon: <ImgBox className="size-8" src={assets.emoji.chill} alt="img" />,
  },
  {
    label: "Party",
    value: "60d5f9b9e9c72f001f5c8f70",
    icon: <ImgBox className="size-7" src={assets.emoji.party} alt="img2" />,
  },
  {
    label: "Mental",
    value: "60d5f9b9e9c72f001f5c8f71",
    icon: <ImgBox className="size-7" src={assets.emoji.mental} alt="img3" />,
  },
  {
    label: "Hot",
    value: "60d5f9b9e9c72f001f5c8f72",
    icon: <ImgBox className="size-7" src={assets.emoji.hot} alt="img4" />,
  },
  {
    label: "Angry",
    value: "60d5f9b9e9c72f001f5c8f73",
    icon: (
      <ImgBox className="size-[23px]" src={assets.emoji.angry} alt="img5" />
    ),
  },
];

export const vibeIcon = (id: string) => {
   console.log(id)
   vibeOptions.find((item: any) => item.value == id);
}
 
