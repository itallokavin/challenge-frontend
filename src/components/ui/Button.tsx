import { Button } from "@mui/material"

interface PrimaryButtonProps {
    type?: "button" | "submit" | "reset"
    label: string
    size?: "small" | "medium" | "large"
    height?: string
}

export const PrimaryButton = (props: PrimaryButtonProps) => {
    return (
        <Button 
            className="w-full" 
            variant="contained"
            size={props.size}
            style={{ height: props.height || "50px" }}
            type={props.type}
        >
        {props.label}
        </Button>
    )
}