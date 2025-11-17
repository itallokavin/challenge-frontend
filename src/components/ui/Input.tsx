import { TextField } from "@mui/material"

interface InputProps {
    id: string
    type: string
    placeholder: string
    register: any
}

export const Input = (props: InputProps) => {
    const label = props.id.charAt(0).toUpperCase() + props.id.slice(1)
    return (
        <div>
            <TextField 
                className="w-full" 
                id={props.id} 
                label={label} 
                type={props.type} 
                placeholder={props.placeholder} 
                variant="outlined"
                {...props.register(props.id)} 
            />
        </div>
    )
}