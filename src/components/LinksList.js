import React from 'react';
import styles from './LinksList.module.css';

function LinksList({ linksData }) {
  return (
    <div className={styles.linkslist}>
      {linksData.sections?.map((section, index) => (
        <div key={index} className={styles.section}>
          <h2 className={styles.title}>{section.title}</h2>
          {section.links.map(link => (
            <div key={link.id} className={styles.link}>
              <span className={styles.linkText}>{link.text}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default LinksList;
