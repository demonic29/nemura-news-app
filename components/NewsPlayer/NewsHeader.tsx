// ニュースタイトル

type Props = {
  title: string
  // estimatedDuration: number
}

export default function NewsHeader({ title }: Props) {
  // const minutes = Math.ceil(estimatedDuration / 60)

  return (
    <div className="relative overflow-x-auto no-scrollbar">
      <h1 className="min-w-max text-base font-semibold text-white-soft sm:text-lg">
        {title}
      </h1>
    </div>
  )
}
