import React, { useState } from 'react';
import { useCollections, useCreateCollection, useUpdateCollection, useDeleteCollection } from '@/hooks/useCollections';
import { useAttachments } from '@/hooks/useAttachments';
import { useForm } from 'react-hook-form';

interface CollectionFormData {
  name: string;
  handle: string;
  description: string;
  imageUrl: string;
  featured: boolean;
  displayOrder: number;
}

const CollectionsPage: React.FC = () => {
  const { data, isLoading } = useCollections();
  const createCollection = useCreateCollection();
  const updateCollection = useUpdateCollection();
  const deleteCollection = useDeleteCollection();
  const { data: attachmentsData } = useAttachments({ status: 'all', limit: 50 });

  const [editing, setEditing] = useState<string | null>(null); // handle
  const [showNew, setShowNew] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerCallback, setPickerCallback] = useState<((url: string) => void) | null>(null);

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '7px 10px', border: '1px solid #d1d5db',
    borderRadius: 6, fontSize: 13, outline: 'none',
  };

  const CollectionForm: React.FC<{
    defaultValues?: Partial<CollectionFormData>;
    onSubmit: (data: CollectionFormData) => void;
    onCancel: () => void;
    isLoading?: boolean;
  }> = ({ defaultValues, onSubmit, onCancel, isLoading: submitting }) => {
    const { register, handleSubmit, setValue, watch } = useForm<CollectionFormData>({
      defaultValues: {
        name: '', handle: '', description: '', imageUrl: '', featured: false, displayOrder: 0,
        ...defaultValues,
      },
    });
    const imageUrl = watch('imageUrl');

    return (
      <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '16px', background: '#f9fafb', borderRadius: 8, marginBottom: 12, border: '1px solid #e5e7eb' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={lblStyle}>Name *</label>
            <input {...register('name', { required: true })} style={inputStyle} />
          </div>
          <div>
            <label style={lblStyle}>Handle (URL slug) *</label>
            <input {...register('handle', { required: true })} style={inputStyle} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={lblStyle}>Description</label>
            <textarea {...register('description')} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div>
            <label style={lblStyle}>Image URL</label>
            <div style={{ display: 'flex', gap: 6 }}>
              <input {...register('imageUrl')} style={inputStyle} placeholder="https://…" />
              <button
                type="button"
                onClick={() => {
                  setPickerCallback(() => (url: string) => { setValue('imageUrl', url); setShowPicker(false); });
                  setShowPicker(true);
                }}
                style={{ padding: '0 10px', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: 6, cursor: 'pointer', fontSize: 12, whiteSpace: 'nowrap' }}
              >
                Pick Asset
              </button>
            </div>
            {imageUrl && <img src={imageUrl} alt="" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4, marginTop: 6 }} />}
          </div>
          <div>
            <label style={lblStyle}>Display Order</label>
            <input type="number" {...register('displayOrder')} style={inputStyle} />
          </div>
        </div>
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" {...register('featured')} id="col-active" />
          <label htmlFor="col-active" style={{ fontSize: 13, cursor: 'pointer' }}>Featured (show on homepage)</label>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <button type="submit" disabled={submitting} style={{ padding: '7px 18px', background: '#111827', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
            {submitting ? 'Saving…' : 'Save'}
          </button>
          <button type="button" onClick={onCancel} style={{ padding: '7px 14px', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
            Cancel
          </button>
        </div>
      </form>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Collections</h1>
        <button
          onClick={() => setShowNew(true)}
          style={{ padding: '8px 18px', background: '#111827', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
        >
          + New Collection
        </button>
      </div>

      {showNew && (
        <CollectionForm
          onSubmit={(data) => createCollection.mutate(data, { onSuccess: () => setShowNew(false) })}
          onCancel={() => setShowNew(false)}
          isLoading={createCollection.isPending}
        />
      )}

      {isLoading ? <p style={{ color: '#6b7280' }}>Loading…</p> : (
        <div style={{ display: 'grid', gap: 12 }}>
          {data?.collections?.map((col) => (
            <div key={col.handle} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
              {editing === col.handle ? (
                <div style={{ padding: 16 }}>
                  <CollectionForm
                    defaultValues={{ name: col.name, handle: col.handle, description: col.description, imageUrl: col.imageUrl, featured: col.featured, displayOrder: col.displayOrder }}
                    onSubmit={(data) => updateCollection.mutate({ handle: col.handle, data }, { onSuccess: () => setEditing(null) })}
                    onCancel={() => setEditing(null)}
                    isLoading={updateCollection.isPending}
                  />
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px' }}>
                  {col.imageUrl && <img src={col.imageUrl} alt={col.name} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 6 }} />}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{col.name}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>/{col.handle}</div>
                    {col.description && <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{col.description}</div>}
                  </div>
                  <span style={{
                    background: col.featured ? '#dcfce7' : '#f3f4f6', color: col.featured ? '#16a34a' : '#6b7280',
                    padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                  }}>{col.featured ? 'Featured' : 'Standard'}</span>
                  <button onClick={() => setEditing(col.handle)} style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, marginLeft: 8 }}>Edit</button>
                  <button onClick={() => { if (window.confirm(`Delete "${col.name}"?`)) deleteCollection.mutate(col.handle); }} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 }}>Delete</button>
                </div>
              )}
            </div>
          ))}
          {!data?.collections?.length && <p style={{ color: '#6b7280' }}>No collections yet.</p>}
        </div>
      )}

      {/* Asset Picker Modal */}
      {showPicker && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, width: '70vw', maxHeight: '70vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700 }}>Choose Image</h3>
              <button onClick={() => setShowPicker(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 10 }}>
              {attachmentsData?.attachments?.map((att) => (
                <div key={att._id} onClick={() => pickerCallback?.(att.url)} style={{ cursor: 'pointer', border: '2px solid #e5e7eb', borderRadius: 6, overflow: 'hidden' }}>
                  <img src={att.url} alt={att.originalName} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const lblStyle: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 4 };

export default CollectionsPage;
