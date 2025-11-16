import * as React from "react";
import Tooltip from "@mui/material/Tooltip";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import { useTheme } from "@mui/material/styles";

export interface TooltipProps {
  showArrow?: boolean;
  content: React.ReactNode;
  children: React.ReactElement;
  disabled?: boolean;
  placement?: "bottom" | "top" | "left" | "right";
  portalled?: boolean;
  portalContainer?: HTMLElement | null;
}

export const CustomTooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  function CustomTooltip(
    {
      showArrow = false,
      children,
      disabled = false,
      content,
      placement = "bottom",
      portalled = true,
      portalContainer = null,
      ...rest
    },
    ref
  ) {
    const theme = useTheme();

    if (disabled) return children;

    return (
      <Tooltip
        title={
          <React.Fragment>
            {content}
            {showArrow ? (
              <span
                style={{
                  position: "absolute",
                  width: 0,
                  height: 0,
                  borderLeft: "6px solid transparent",
                  borderRight: "6px solid transparent",
                  borderTop: placement === "bottom" ? `6px solid ${theme.palette.background.paper}` : undefined,
                  borderBottom: placement === "top" ? `6px solid ${theme.palette.background.paper}` : undefined,
                  bottom: placement === "bottom" ? 0 : undefined,
                  top: placement === "top" ? 0 : undefined,
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              />
            ) : null}
          </React.Fragment>
        }
        arrow={showArrow}
        placement={placement}
        PopperComponent={(props) =>
          portalled ? <Popper {...props} container={portalContainer || undefined} /> : <Popper {...props} />
        }
        TransitionComponent={Fade}
        {...rest}
        ref={ref}
      >
        {children}
      </Tooltip>
    );
  }
);
