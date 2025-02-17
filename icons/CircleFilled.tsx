type Props = {
  className?: string;
};

export default function CircleFilled({ className }: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={`icon ${className || ""}`}>
      <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512z" />
    </svg>
  );
}
