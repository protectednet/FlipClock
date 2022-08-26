import Attributes from "./Attributes";

export default interface HasAttributes {
    setAttributes(attributes: Attributes): void;
    getAttributes(): Attributes;
}