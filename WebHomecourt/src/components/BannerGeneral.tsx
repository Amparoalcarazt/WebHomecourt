type BannerReputProps = {
  title: string
  subtitle?: string
}

export default function BannerGeneral({
  title,
  subtitle,
}: BannerReputProps) {
  return (
    <div className="w-full p-6 bg-morado-oscuro rounded-2xl shadow inline-flex flex-col gap-2">
        <h1 className="text-zinc-100">{title}</h1>
        {subtitle && <h5 className="mt-2 text-xl text-zinc-100">{subtitle}</h5>}
    </div>
  )
}