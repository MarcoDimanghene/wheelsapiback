import { Model, Schema, Types, model } from "mongoose";
import Usuario from "./usuario";

export interface IIssue {
    title:String;
    desciption: String;
    priority: Number;
    user: Types.ObjectId;
    createdAt:Date
}

const IssueSchema = new Schema<IIssue>({
    title:{
        type: String,
        required: [true, "El título es requerido"]
    },
    desciption:{
        type: String,
        required: [true, "Necesitamos una descripción"]
    },

    priority:{
        type: Number,
        required: [true, "la prioridad es obligatoria"]
    },

    user:{
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },

    createdAt:{
        type: Date,
        default: Date.now
    },
})
const Issue: Model<IIssue> = model<IIssue>("Issui", IssueSchema)

export default IIssue