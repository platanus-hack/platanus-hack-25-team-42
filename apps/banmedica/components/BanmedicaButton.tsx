import { classNames } from "../helpers/classNames";

export function BanmedicaButton({
  primary = false,
  fullwidth = false,
  className,
  onClick,
  ...props
}: React.ComponentProps<"button"> & {
  primary?: boolean;
  fullwidth?: boolean;
}) {
  return (
    <button
      className={classNames(
        className,
        "flex h-[44px] flex-row items-center justify-center rounded-md border border-solid px-6 py-3 text-sm font-medium transition-colors",
        fullwidth ? "w-full" : "w-fit",
        primary
          ? "border-transparent bg-[#E30613] text-white hover:bg-[#c00510]"
          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
        "cursor-pointer"
      )}
      onClick={onClick}
      {...props}
    />
  );
}
