import React, { useCallback, useState } from 'react';
import {
  useAttachments,
  useUploadAttachment,
  useDeleteAttachment,
  useCleanupAttachments,
} from '@/hooks/useAttachments';

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const AttachmentsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'linked' | 'unlinked'>('all');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAttachments({ status: filter, page, limit: 24 });
  const upload = useUploadAttachment();
  const deleteAtt = useDeleteAttachment();
  const cleanup = useCleanupAttachments();
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      Array.from(files).forEach((file) => upload.mutate(file));
    },
    [upload]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Attachments</h1>
          <p style={{ color: '#6b7280', marginTop: 4, fontSize: 13 }}>
            Upload and manage image assets. Link them to products or collections.
          </p>
        </div>
        <button
          onClick={() => cleanup.mutate()}
          disabled={cleanup.isPending}
          style={{
            padding: '8px 16px', background: '#ef4444', color: '#fff',
            border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 500,
          }}
        >
          {cleanup.isPending ? 'Cleaning…' : '🗑 Delete Unlinked'}
        </button>
      </div>

      {/* Upload dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => document.getElementById('att-file-input')?.click()}
        style={{
          border: `2px dashed ${dragging ? '#f59e0b' : '#d1d5db'}`,
          borderRadius: 10,
          padding: '32px',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragging ? '#fffbeb' : '#fff',
          marginBottom: 24,
          transition: 'all 0.15s',
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 8 }}>🖼️</div>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>Drop images here or click to upload</div>
        <div style={{ color: '#6b7280', fontSize: 13 }}>JPG, PNG, WebP — max 10MB each</div>
        <input
          id="att-file-input"
          type="file"
          multiple
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleFiles(e.target.files)}
        />
        {upload.isPending && (
          <div style={{ marginTop: 8, color: '#f59e0b', fontSize: 13 }}>Uploading…</div>
        )}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['all', 'linked', 'unlinked'] as const).map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); setPage(1); }}
            style={{
              padding: '6px 16px',
              background: filter === f ? '#111827' : '#fff',
              color: filter === f ? '#fff' : '#374151',
              border: '1px solid #e5e7eb',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: filter === f ? 600 : 400,
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        {data && (
          <span style={{ marginLeft: 'auto', fontSize: 13, color: '#6b7280', alignSelf: 'center' }}>
            {data.total} item{data.total !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Grid */}
      {isLoading ? (
        <p style={{ color: '#6b7280' }}>Loading…</p>
      ) : data?.attachments?.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No attachments found.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 12,
          marginBottom: 24,
        }}>
          {data?.attachments?.map((att) => (
            <div
              key={att._id}
              style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <img
                src={att.url}
                alt={att.originalName}
                style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/180'; }}
              />
              <div style={{ padding: '8px 10px' }}>
                <div style={{ fontSize: 11, color: '#374151', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {att.originalName}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                  <span style={{ fontSize: 10, color: '#9ca3af' }}>{formatBytes(att.size)}</span>
                  {att.linkedTo.resourceType ? (
                    <span style={{ fontSize: 10, background: '#dcfce7', color: '#16a34a', padding: '1px 6px', borderRadius: 3 }}>
                      {att.linkedTo.resourceType}
                    </span>
                  ) : (
                    <span style={{ fontSize: 10, background: '#fee2e2', color: '#dc2626', padding: '1px 6px', borderRadius: 3 }}>
                      unlinked
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Delete this attachment?')) deleteAtt.mutate(att._id);
                  }}
                  style={{
                    marginTop: 6, width: '100%', padding: '4px', background: 'transparent',
                    color: '#ef4444', border: '1px solid #fca5a5', borderRadius: 4,
                    cursor: 'pointer', fontSize: 11,
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.pages > 1 && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                width: 32, height: 32,
                background: p === page ? '#111827' : '#fff',
                color: p === page ? '#fff' : '#374151',
                border: '1px solid #e5e7eb', borderRadius: 4, cursor: 'pointer', fontSize: 13,
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttachmentsPage;
