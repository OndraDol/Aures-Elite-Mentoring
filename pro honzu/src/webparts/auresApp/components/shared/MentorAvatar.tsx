import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { IMentor } from '../../../../services/interfaces';
import { getMentorInitials, resolveMentorAvatar } from './mentorAvatarCatalog';

type MentorAvatarVariant = 'default' | 'catalog' | 'primary';

interface IMentorAvatarProps {
  mentor: Pick<IMentor, 'Id' | 'Title' | 'PhotoUrl' | 'MentorUser'>;
  variant?: MentorAvatarVariant;
}

const MentorAvatar: React.FC<IMentorAvatarProps> = ({ mentor, variant = 'default' }) => {
  const avatar = resolveMentorAvatar(mentor);

  const baseClassName = variant === 'primary'
    ? styles.primaryMentorAvatar
    : styles.mentorAvatar;

  const variantClassName = variant === 'catalog'
    ? styles.mentorAvatarCatalog
    : '';

  const photoClassName = variant === 'primary'
    ? styles.primaryMentorAvatarHasPhoto
    : styles.mentorAvatarHasPhoto;

  const imageClassName = variant === 'primary'
    ? styles.primaryMentorAvatarImage
    : styles.mentorAvatarImage;

  return (
    <div
      className={[baseClassName, variantClassName, avatar ? photoClassName : '']
        .filter(Boolean)
        .join(' ')}
    >
      {avatar ? (
        <img
          className={imageClassName}
          src={avatar.src}
          alt={`PortrĂ©t ${mentor.Title}`}
          style={{ objectPosition: avatar.position }}
        />
      ) : (
        getMentorInitials(mentor.Title)
      )}
    </div>
  );
};

export default MentorAvatar;
