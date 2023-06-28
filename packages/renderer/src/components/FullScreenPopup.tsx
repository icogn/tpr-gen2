import styles from './FullScreenPopup.module.css';

type FullScreenPopupProps = {
  children: React.ReactNode;
};

function FullScreenPopup({children}: FullScreenPopupProps) {
  return (
    <div className={styles.root}>
      <div className={styles.contentWrapper}>{children}</div>
    </div>
  );
}

export default FullScreenPopup;
