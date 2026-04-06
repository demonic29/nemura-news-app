// ニュース本文エリア

type Props = {
  body: string
}

export default function NewsBody({ body }: Props) {
  return (
    <div className="px-4 pb-4 text-white-soft sm:px-6 sm:pb-6">
      <p className="text-sm leading-relaxed sm:text-[14px]">
        {body}
      </p>
    </div>
  )
}
