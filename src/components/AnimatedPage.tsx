import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const AnimatedPage = ({ children }: Props) => {
  return <div>{children}</div>;
};

export default AnimatedPage;
