import { ComponentProps, PropsWithChildren } from "react";

import { flex } from "@/styled-system/patterns";

type Props = ComponentProps<"button">;

export function IconButton({
  children,
  ...props
}: PropsWithChildren<Props>): JSX.Element {
  return (
    <button
      className={flex({
        alignItems: "center",
        justifyContent: "center",
        w: "32px",
        h: "32px",
        bg: "transparent",
        border: "none",
        cursor: "pointer",
        rounded: "full",
        _hover: { bg: "gray.300" },
      })}
      {...props}
    >
      {children}
    </button>
  );
}
