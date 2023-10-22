import { useState } from 'react'
import './App.css'

type Relation = {
  x: number;
  y: number;
}

type RelationOptions = 'X' | 'Y';

const RelationsModal: React.FunctionComponent<{ 
  relations: [Relation, Relation];
  onSubmit: (value: [selectedOption: number, mm: number]) => void;
}> = (props) => {
  const { relations, onSubmit } = props;

  const [selectedOption, setSelectedOption] = useState<RelationOptions | null>(null);
  const [inputValue, setInputValue] = useState<number>(0);

  const xSelections = relations.map(r => r.x);
  const ySelections = relations.map(r => r.y);

  const xOption = Math.max(...xSelections) - Math.min(...xSelections);
  const yOption = Math.max(...ySelections) - Math.min(...ySelections);

  const options: [RelationOptions, number][] = [['X', xOption], ['Y', yOption]];

  return (
    <div className='backdrop'>
      <div className='modal'>
        <h3>
          Select right relation
        </h3>
        <div className='options'>
          {options.map(option => (
            <button 
            className={option[0] === selectedOption ? 'selected' : undefined}
            onClick={() => setSelectedOption(option[0])}
            key={option[0]}>
              {option[0]} - {option[1]}
            </button>
          ))}
        </div>
        <input 
        className='number-input'
        type='number' 
        value={inputValue}
        onChange={(e) => setInputValue(Number(e.target.value))}
        placeholder='Enter measurement in mm'/>
        <button 
        onClick={() => {
          const option = options.find(o => o[0] === selectedOption)?.[1];
          console.log("heree", option, inputValue);
          
          if(typeof option === 'undefined' || !inputValue) {
            return;
          }
          onSubmit([option, inputValue])
        }}
        disabled={!selectedOption || !inputValue || inputValue <= 0}>
          Submit
        </button>
      </div>
    </div>
  )
}

function App() {
  const [image, setImage] = useState<null | string>(null);

  const [offsetLeft, setOffsetLeft] = useState<number | null>(null);
  const [offsetTop, setOffsetTop] = useState<number | null>(null);

  const [isSetRelations, setIsSetRelations] = useState<boolean>(false);
  const [relationClicks, setRelationClicks] = useState<[Relation | null, Relation | null]>([null, null]);

  const [selectedRatio, setSelectedRatio] = useState<number | null>(null);

  const [where, setWhere] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const relationsNullClicks = relationClicks.filter(r => r === null).length;
  const isValidRelations = relationsNullClicks === 0;


  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  }

  const onImageClick = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if(offsetLeft === null || offsetTop === null) {
      setOffsetLeft(event.pageX);
      setOffsetTop(event.pageY);

      return;
    }
    const x = event.pageX - offsetLeft;
    const y = (event.pageY - offsetTop) * -1;

    if(isSetRelations && !isValidRelations) { 
      if(relationsNullClicks === 2) {
        setRelationClicks([{ x, y }, null])
      }
      if(relationsNullClicks === 1) {
        setRelationClicks(prev => [prev[0], { x, y }])
      }
    }

    if(selectedRatio) {
      setWhere({ x: x * selectedRatio, y: y * selectedRatio })
    }
    console.log({ x, y });
  }
  
  console.log("where", where);
  
  return (
    <div className='container'>
    <input type="file" onChange={onImageChange} className="filetype" />

    {offsetLeft !== null && offsetTop !== null &&
    <div className='coordinates-container'>
      <h3>Zero Axis</h3>
      <span>
        X start from - {offsetTop}
      </span>
      <span>
        Y start from - {offsetLeft}
      </span>
    </div>}

    {image &&
    <button 
    onClick={() => setIsSetRelations(true)}>
      Set Relations
      {isSetRelations && !isValidRelations && ` - Waiting for ${relationClicks.filter(r => r === null).length} clicks`}
    </button>}

    {isValidRelations && !selectedRatio &&
    <RelationsModal 
    onSubmit={(value) => {
      console.log(value);
      setSelectedRatio(value[1] / value[0])
    }}
    relations={relationClicks as [Relation, Relation]}/>}

    {image &&
    <img 
    onClick={onImageClick}
    alt="preview image" width='800px' height='500px' src={image}/>}
  </div>

  )
}

export default App
