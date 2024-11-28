import { TriangleAlert } from "lucide-react"

const NotSelected = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <TriangleAlert />
      <p className="text-neutral text-center mt-4">
        Nothing to show here {":'("}
      </p>
      <p className="text-neutral text-center mt-2">
        To see equipment statistics, please fill specifics equipment you want to see
      </p>
    </div>

  )
}

export default NotSelected