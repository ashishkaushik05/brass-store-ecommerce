
import React from 'react';
import { Link } from 'react-router-dom';
import { Collection } from '../types';

interface CollectionCardProps {
  collection: Collection;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
  return (
    <Link to={`/collections/${collection.handle}`} className="group flex flex-col gap-4 cursor-pointer">
      <div className="overflow-hidden rounded-xl aspect-[3/4] relative">
        <div 
          className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url(${collection.imageUrl})` }}
        ></div>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
      </div>
      <div>
        <h3 className="text-text-main dark:text-white text-xl font-serif font-medium group-hover:text-primary transition-colors">{collection.name}</h3>
        <p className="text-text-subtle text-sm mt-1">{collection.description}</p>
      </div>
    </Link>
  );
};

export default CollectionCard;
