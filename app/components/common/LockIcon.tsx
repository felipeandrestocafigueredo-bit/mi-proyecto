const INK = "#243B53";

interface LockIconProps {
    size?: number;
    color?: string;
}

export default function LockIcon({
    size = 16,
    color = INK,
    ...props
}: LockIconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <rect
                x="3"
                y="11"
                width="18"
                height="11"
                rx="2"
            />

            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );
}
