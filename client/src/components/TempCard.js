import { Card } from "@mui/material";

export default function TempCards({objs}) {
    return (
        <div className="d-flex">
            {objs.map((obj) => (
                <Card className="p-3 m-2">
                    {obj.title}
                </Card>
            ))}
        </div>
    )
}