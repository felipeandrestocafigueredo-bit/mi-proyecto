import { ReactNode, MouseEvent } from "react";

const TYPES = {
    primary: {
        bg: "#4F46E5",
        color: "#FFFFFF",
        border: "#4F46E5",
    },
    secondary: {
        bg: "#FFFFFF",
        color: "#243B53",
        border: "#D6DCE5",
    },
    success: {
        bg: "#16A34A",
        color: "#FFFFFF",
        border: "#16A34A",
    },
    danger: {
        bg: "#DC2626",
        color: "#FFFFFF",
        border: "#DC2626",
    },
    ghost: {
        bg: "transparent",
        color: "#243B53",
        border: "transparent",
    },
};

type ButtonType = "primary" | "secondary" | "success" | "danger" | "ghost";

interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
    type?: ButtonType;
    icon?: ReactNode;
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    style?: React.CSSProperties;
}

export default function Button({
    children,
    onClick,
    type = "primary",
    icon = null,
    disabled = false,
    loading = false,
    fullWidth = false,
    style = {},
}: ButtonProps) {
    const colors = TYPES[type] || TYPES.primary;

    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "12px 18px",
                borderRadius: 14,
                border: `2px solid ${colors.border}`,
                background: disabled
                    ? "#ECEFF3"
                    : colors.bg,
                color: disabled
                    ? "#7B8794"
                    : colors.color,
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 700,
                fontSize: 15,
                cursor: disabled
                    ? "not-allowed"
                    : "pointer",
                transition: ".20s",
                width: fullWidth
                    ? "100%"
                    : "auto",
                boxShadow: disabled
                    ? "none"
                    : "0 4px 10px rgba(0,0,0,.12)",
                ...style,
            }}
            onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                if (disabled) return;
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 18px rgba(0,0,0,.18)";
            }}
            onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow = disabled
                    ? "none"
                    : "0 4px 10px rgba(0,0,0,.12)";
            }}
        >
            {loading ? (
                <>⏳ Cargando...</>
            ) : (
                <>
                    {icon}
                    {children}
                </>
            )}
        </button>
    );
}
