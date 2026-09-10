export function DeveloperPage() {
    return (
        <div
            className="developer-page developer-image-page"
            aria-label="Developer profile image"
            onContextMenu={(event) => event.preventDefault()}
        >
            <div className="developer-image-frame">
                <img
                    className="developer-image"
                    src="/developer-1.png"
                    alt="Developer profile"
                    draggable={false}
                    onDragStart={(event) => event.preventDefault()}
                />
            </div>

            <div className="developer-page-actions">
                <a
                    className="developer-website-link"
                    href="https://duraib.vercel.app"
                    target="_blank"
                    rel="noreferrer"
                >
                    Visit My Website
                </a>
            </div>
        </div>
    );
}
