import styles from "./header.module.css";

function Header({
    headerText,
    headerSubText,
    onClose
}: {
    headerText: string,
    headerSubText: string,
    onClose: () => void
}) {
    return (
        <div className={styles.header}>
            <div className={styles.content}>
                <div className={styles.featureIcon}>
                    <div className={styles.buildingIcon}>
                        <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 9H16.8C17.9201 9 18.4802 9 18.908 9.21799C19.2843 9.40973 19.5903 9.71569 19.782 10.092C20 10.5198 20 11.0799 20 12.2V19M12 19V4.2C12 3.0799 12 2.51984 11.782 2.09202C11.5903 1.71569 11.2843 1.40973 10.908 1.21799C10.4802 1 9.9201 1 8.8 1H5.2C4.0799 1 3.51984 1 3.09202 1.21799C2.71569 1.40973 2.40973 1.71569 2.21799 2.09202C2 2.51984 2 3.0799 2 4.2V19M21 19H1M5.5 5H8.5M5.5 9H8.5M5.5 13H8.5" stroke="#97B00F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
                <div className={styles.textAndSupportingText}>
                    <p className={styles.text}>{headerText}</p>
                    <p className={styles.supportingText}>{headerSubText}</p>
                </div>
            </div>
            <div className={styles.closeButton}>
                <button onClick={onClose} className={styles.xClose}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 1L1 13M1 1L13 13" stroke="#717680" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
            <div className={styles.padding}></div>
            <div className={styles.divider}></div>
        </div>
    )
}

export default Header;