import { badgeClass } from "../utils";

export default function Badge({ status }) {
  return <span className={`badge ${badgeClass(status)}`}>{status}</span>;
}
