import { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number;
}

const Icon = {
    Search: ({ size = 20, ...props }: IconProps) => (
        <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
        </svg>
    ),

    Gallows: ({ size = 20, ...props }: IconProps) => (
        <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M5 21h6M8 21V4h9v3M8 4h5M14 7a3 3 0 0 1 3 3" />
            <circle cx="17" cy="13" r="2" />
            <path d="M17 15v3M17 16l-2 2M17 16l2 2" />
        </svg>
    ),

    Chevron: ({ size = 18, ...props }: IconProps) => (
        <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M9 18l6-6-6-6" />
        </svg>
    ),

    Back: ({ size = 18, ...props }: IconProps) => (
        <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M15 18l-6-6 6-6" />
        </svg>
    ),

    Check: ({ size = 14, ...props }: IconProps) => (
        <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M20 6L9 17l-5-5" />
        </svg>
    ),

    Dot: ({ size = 8, ...props }: IconProps) => (
        <svg
            viewBox="0 0 8 8"
            width={size}
            height={size}
            fill="currentColor"
            {...props}
        >
            <circle cx="4" cy="4" r="4" />
        </svg>
    ),
};

export default Icon;
