interface ShowErrorBannerProps {
  msg: string;
}

const ShowErrorBanner: React.FC<ShowErrorBannerProps> = ({msg}) => {
    return (
        <div className="bg-red-300 p-3 rounded-md m-6 ">
            <p>❌ {msg}</p>
        </div>
    )
}

export default ShowErrorBanner