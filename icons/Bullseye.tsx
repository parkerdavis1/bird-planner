type Props = {
  className?: string;
};

export default function Bullseye({ className }: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={`icon ${className}`}>
      <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM256 368a112 112 0 1 0 0-224 112 112 0 1 0 0 224zm0-272a160 160 0 1 1 0 320 160 160 0 1 1 0-320zm0 176a16 16 0 1 0 0-32 16 16 0 1 0 0 32zm0-80a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
    </svg>
  );
}
