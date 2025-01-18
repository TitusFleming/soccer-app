export default function LoadingDots() {
  return (
    <div className="flex space-x-1.5 items-center">
      <div className="w-2 h-2 bg-secondary-foreground/60 rounded-full animate-[bounce_1.4s_infinite_.1s]" />
      <div className="w-2 h-2 bg-secondary-foreground/60 rounded-full animate-[bounce_1.4s_infinite_.2s]" />
      <div className="w-2 h-2 bg-secondary-foreground/60 rounded-full animate-[bounce_1.4s_infinite_.3s]" />
    </div>
  )
} 