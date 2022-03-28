import React, {useState} from 'react';
import Picker from 'emoji-picker-react';

/**
 * Emoji picker example
 *
 * @return {object} JSX
 */
function Emoji({onSelect, show}) {
  const [emoji, setEmoji] = useState(null);

  const onEmojiClick = (event, emojiObject) => {
    setEmoji(emojiObject);
    if(emoji && emoji.emoji){
      onSelect(emoji.emoji)
    }
  };

  return (
    <>
    {show ? (<Picker onEmojiClick={onEmojiClick} />):null}
    </>
  );
};

export default Emoji;
