import MainNav from "@/components/main-nav";
import Window from "@/components/window";

interface DefaultLayoutProps {
  openedWindow: string | null;
  onButtonClick: (windowName: string) => void;
  onPlaySimulation: () => void;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({
  openedWindow,
  onButtonClick,
  onPlaySimulation,
}) => {
  return (
    <div className="">
      <div className="absolute top-2 right-5 text-white "> mvp v0.4</div>
      <MainNav
        onButtonClick={onButtonClick}
        onPlaySimulation={onPlaySimulation}
      />
      <Window position="right" windowTag={openedWindow} />
      <div className="absolute bottom-4 left-7 text-white">
        <a href="https://www.netlify.com">
          <img
            src="/netlify-dark.svg"
            alt="Deploys by Netlify"
            className="sm:h-8"
          />
        </a>
      </div>
    </div>
  );
};

export default DefaultLayout;
