import { ReactNode, MouseEvent } from "react";

interface CardProps {
    children?: ReactNode;
    title?: string;
    subtitle?: string;
    icon?: ReactNode;
    right?: ReactNode;
    footer?: ReactNode;
    onClick?: () => void;
    style?: React.CSSProperties;
    titleColor?: string;
}

export default function Card({
    children,
    title,
    subtitle,
    icon,
    right,
    footer,
    onClick,
    style = {},
    titleColor,
}: CardProps) {
    const clickable = typeof onClick === "function";

    return (
        <div
            onClick={onClick}
            style={{
                background: "#fff",
                border: "2px solid rgba(36,31,26,.10)",
                borderRadius: 18,
                padding: 18,
                boxShadow: "0 6px 16px rgba(0,0,0,.06)",
                transition: ".18s",
                cursor: clickable ? "pointer" : "default",
                ...style,
            }}
            onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
                if (!clickable) return;
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                    "0 12px 28px rgba(0,0,0,.12)";
                e.currentTarget.style.borderColor = "#4F8EF7";
            }}
            onMouseLeave={(e: MouseEvent<HTMLDivElement>) => {
                if (!clickable) return;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                    "0 6px 16px rgba(0,0,0,.06)";
                e.currentTarget.style.borderColor =
                    "rgba(36,31,26,.10)";
            }}
        >
            {(icon || title || right) && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 12,
                        marginBottom:
                            children || footer ? 14 : 0,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            gap: 12,
                            alignItems: "center",
                            flex: 1,
                        }}
                    >
                        {icon && (
                            <div
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 14,
                                    background: "#EEF5FF",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 24,
                                    flexShrink: 0,
                                }}
                            >
                                {icon}
                            </div>
                        )}

                        <div style={{ flex: 1 }}>
                            {title && (
                                <div
                                    style={{
                                        fontSize: 18,
                                        fontWeight: 800,
                                        color: titleColor || "#243B53",
                                        fontFamily: "'Fredoka', sans-serif",
                                    }}
                                >
                                    {title}
                                </div>
                            )}

                            {subtitle && (
                                <div
                                    style={{
                                        marginTop: 4,
                                        fontSize: 13,
                                        color: "#6B7280",
                                        lineHeight: 1.5,
                                    }}
                                >
                                    {subtitle}
                                </div>
                            )}
                        </div>
                    </div>

                    {right && (
                        <div
                            style={{
                                flexShrink: 0,
                            }}
                        >
                            {right}
                        </div>
                    )}
                </div>
            )}

            {children && (
                <div
                    style={{
                        fontSize: 14,
                        lineHeight: 1.7,
                        color: "#243B53",
                    }}
                >
                    {children}
                </div>
            )}

            {footer && (
                <div
                    style={{
                        marginTop: 18,
                        paddingTop: 14,
                        borderTop:
                            "1px solid rgba(36,31,26,.08)",
                    }}
                >
                    {footer}
                </div>
            )}
        </div>
    );
}
