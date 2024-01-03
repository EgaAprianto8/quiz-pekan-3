import Link from "next/link";

export default function Menu() {
  return (
  <>
  <div className="flex flex-row justify-end gap-4 text-white p-4">
    <Link href="/" className="bg-blue-800 rounded-xl p-2">Home</Link>
  </div>
  </>
  )
}