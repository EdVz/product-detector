import { ReactNode, createContext, useContext, useState } from 'react'

interface NewObjectContextType {
    newObjectNames: string[];
    setNewObjectNames: React.Dispatch<React.SetStateAction<string[]>>;
    predictedObjectName: string;
    setPredictedObjectName: React.Dispatch<React.SetStateAction<string>>;
}

export const NewObjectContext = createContext<NewObjectContextType | undefined>(undefined);

export const NewObjectProvider = ({ children }: { children: ReactNode }) => {

    const [newObjectNames, setNewObjectNames] = useState<string[]>([]);
    const [predictedObjectName, setPredictedObjectName] = useState<string>('');

    const value = {
        newObjectNames,
        setNewObjectNames,
        predictedObjectName,
        setPredictedObjectName,
    };

    return <NewObjectContext.Provider value={value}>
        {children}
    </NewObjectContext.Provider>
}

export const useNewObject = () => useContext(NewObjectContext);

