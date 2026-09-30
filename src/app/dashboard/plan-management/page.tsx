"use client";
import RepeatCount from "@/components/reuseble/repeat-count/count";
import { InputSelectField } from "@/components/reuseble/from-select";
import Modal2 from "@/components/reuseble/modal2";
import { CloseIcon } from "@/components/reuseble/btn-modal";
import FromColorPicker from "@/components/reuseble/from-color";
import ShadowBox from "@/components/common/shadow-box";
import { BackBtn } from "@/components/reuseble/back-btn";
import WapperBox from "@/components/reuseble/wapper-box";
import { Button, Skeleton } from "@/components/ui";
import { FieldValues, useForm } from "react-hook-form";
import Form from "@/components/reuseble/from";
import { FromInput } from "@/components/reuseble/from-input";
import { X } from "lucide-react";
import FavIcon from "@/icon/favIcon";
import { useEffect,useState } from "react";
import {
  useGetPlanQuery,
  useUpdatePlanMutation,
} from "@/redux/api/subscribersApi";
import { toast } from "sonner";


export default function Planmanagement() {
  const [isUpdate, setIsUpdate] = useState(false);
  const { data: plans, isLoading } = useGetPlanQuery({});
  const [isPlan, setIsPlan] = useState<any>({});
  const [updatePlan, { isLoading: UpdateLoading }] = useUpdatePlanMutation();
 
  const fromUpdate = useForm({
    defaultValues: {
      name: "",
      color: "",
      price: "",
      interval: "",
    },
  });

  useEffect(() => {
    fromUpdate.reset({
      color: isPlan?.color,
      name: isPlan?.name,
      price: isPlan?.price,
      interval: isPlan.interval,
    });
  }, [fromUpdate, isPlan]);

  const handleSubmitUpdate = async (values: FieldValues) => {
    const value = {
      ...values,
      currency: "usd",
    };
    const res = await updatePlan({ id: isPlan._id, data: value }).unwrap();
    if (res.success) {
      toast.success("Plan Updated Successfully", {
        description: "Your plan has been updated successfully.",
      });
      handleUpdateReset();
    }
  };

  // handleUpdateReset
  const handleUpdateReset = () => {
    fromUpdate.reset();
    setIsPlan({});
    setIsUpdate(false);
  };

  return (
    <div>
      <ShadowBox>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
          <div className="flex gap-2">
            <BackBtn />
            <div>
              <h1 className="text-2xl font-semibold">Plan management</h1>
              <h1 className="text-base">
                {plans?.data?.length || 0} Active Plans
              </h1>
            </div>
          </div>
        </div>
      </ShadowBox>
      <WapperBox>
        <div className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {isLoading ? (
              <RepeatCount count={6}>
                <Skeleton className="h-[450px] w-full" />
              </RepeatCount>
            ) : (
              plans?.data?.map((plan: any) => (
                <div
                  key={plan._id}
                  className={`rounded-2xl relative flex flex-col bg-blur bg-blacks/20  justify-between py-6 pl-6  border text-white overflow-hidden`}
                >
                  <span className="absolute !z-50 cursor-pointer right-2 top-2">
                    <Button
                      onClick={() => {
                        setIsPlan(plan);
                        setIsUpdate(!isUpdate);
                      }}
                      size="icon"
                      variant="outline"
                      className="rounded-md"
                    >
                      <FavIcon className="size-4" name="edit" />
                    </Button>
                  </span>
                  <div
                    style={{
                      background: `linear-gradient(148deg, rgba(29, 29, 29, 0.20),rgba(29, 29, 29, 0.20), ${plan?.color})`,
                      opacity: 0.3,
                    }}
                    className="w-[360px] h-[300px] absolute bottom-0 z-0 right-0"
                  ></div>
                  <div className="z-1">
                    {/* Header */}
                    <div className="mb-6">
                      <h3 className="text-xl font-medium mb-2">{plan.name}</h3>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-semibold">
                          {plan.price}
                        </span>
                        <span className="ml-1 text-secondery-figma">
                          / {plan.interval}
                        </span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-8">
                      <div className="flex items-center justify-center">
                        <h1 className="text-lg font-medium mr-2"> Features</h1>
                        <h1 className="bg-border h-px w-full mt-1"></h1>
                      </div>
                      <ul className="space-y-2 mt-5">
                        {plan?.features?.map((feature: any, index: any) => (
                          <li key={index} className="flex items-start">
                            <span className="text-white/80 mr-2 mt-1 flex-shrink-0">
                              •
                            </span>
                            <span className="text-white/90 leading-relaxed">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </WapperBox>

      {/* =================Update plan  ================ */}
      <Modal2
        open={isUpdate}
        setIsOpen={setIsUpdate}
        title="Update Plan"
        titleStyle="text-center"
      >
        <CloseIcon className="mt-2 mr-2" onClose={() => handleUpdateReset()} />
        <Form from={fromUpdate} onSubmit={handleSubmitUpdate}>
          <div  className="space-y-5">
          <FromColorPicker label="Color" name="color" />
            <FromInput
              name="name"
              label="Plan Name"
              placeholder="Plan name hare"
            />
            <FromInput
              name="price"
              label="Price"
              type="number"
              placeholder="Price hare for number"
            />
            <InputSelectField
              items={[
                { value: "week", label: "Week" },
                { value: "month", label: "Month" },
                { value: "year", label: "Year" },
              ]}
              name="interval"
              label="Interval"
              placeholder="Price hare for number"
            />
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleUpdateReset()}
                size="lg"
                type="button"
                className="bg-modal-figma hover:bg-modal-figma cursor-pointer  rounded-xl w-full"
              >
                <X className="size-5" />
                Cancel
              </Button>
              <Button
                disabled={UpdateLoading}
                variant="primary"
                size="lg"
                className="w-full"
              >
                <FavIcon name="save" />
                Save changes
              </Button>
            </div>
          </div>
        </Form>
      </Modal2>
    </div>
  );
}
