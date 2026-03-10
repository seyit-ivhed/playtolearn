import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'lucide-react';
import styles from './PasswordInput.module.css';

type PasswordInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>;

export const PasswordInput: React.FC<PasswordInputProps> = (props) => {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);

    return (
        <div className={styles.wrapper}>
            <input
                {...props}
                type={visible ? 'text' : 'password'}
            />
            <button
                type="button"
                className={styles.toggleButton}
                onClick={() => setVisible((v) => !v)}
                aria-label={visible ? t('common.hide_password') : t('common.show_password')}
                disabled={props.disabled}
            >
                {visible ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
        </div>
    );
};
