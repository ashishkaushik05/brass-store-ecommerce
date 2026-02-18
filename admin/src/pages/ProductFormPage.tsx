import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useProduct, useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import { useAttachments } from '@/hooks/useAttachments';
import { useCollections } from '@/hooks/useCollections';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  category: string;
  collectionHandle?: string;
  tags: string;
  stock: number;
  isActive: boolean;
  metaFinish?: string;
  metaUsage?: string;
  metaDimensions?: string;
  metaWeight?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = ['Dinnerware', 'Serveware', 'Cookware', 'Décor', 'Ritual', 'Gifting'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 24, marginBottom: 16 }}>
    <h2 style={{ fontSize: 13, fontWeight: 700, color: '#6b7280', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 18 }}>{title}</h2>
    {children}
  </div>
);

const Field: React.FC<{
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  full?: boolean;
}> = ({ label, required, error, hint, children, full }) => (
  <div style={{ gridColumn: full ? '1 / -1' : undefined }}>
    <label style={labelStyle}>{label}{required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}</label>
    {children}
    {hint && !error && <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{hint}</div>}
    {error && <div style={{ fontSize: 11, color: '#ef4444', marginTop: 2 }}>{error}</div>}
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

const ProductFormPage: React.FC = () => {
  const { id: slug } = useParams<{ id: string }>();
  const isEdit = !!slug && slug !== 'new';
  const navigate = useNavigate();

  const { data: existing, isLoading: loadingProduct } = useProduct(isEdit ? slug! : '');
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  const { data: attachmentsData } = useAttachments({ status: 'all', limit: 100 });
  const { data: collectionsData } = useCollections();

  const product = existing?.product;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProductFormData>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      sku: '',
      category: CATEGORIES[0],
      collectionHandle: '',
      tags: '',
      stock: 0,
      isActive: true,
      metaFinish: '',
      metaUsage: '',
      metaDimensions: '',
      metaWeight: '',
    },
  });

  // Populate form when product loads (edit mode)
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description ?? '',
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        sku: product.sku,
        category: product.category,
        collectionHandle: product.collectionHandle ?? '',
        tags: product.tags?.join(', ') ?? '',
        stock: product.stock,
        isActive: product.isActive,
        metaFinish: product.metadata?.finish ?? '',
        metaUsage: product.metadata?.usage ?? '',
        metaDimensions: product.metadata?.dimensions ?? '',
        metaWeight: product.metadata?.weight ?? '',
      });
      setSelectedImages(product.images ?? []);
    }
  }, [product, reset]);

  const onSubmit = async (data: ProductFormData) => {
    const productSlug = isEdit ? slug! : toSlug(data.name);
    const payload: Record<string, unknown> = {
      name: data.name,
      slug: productSlug,
      description: data.description,
      price: Number(data.price),
      sku: data.sku,
      category: data.category,
      tags: data.tags.split(',').map((t) => t.trim()).filter(Boolean),
      stock: Number(data.stock),
      isActive: data.isActive,
      images: selectedImages,
      metadata: {
        ...(data.metaFinish ? { finish: data.metaFinish } : {}),
        ...(data.metaUsage ? { usage: data.metaUsage } : {}),
        ...(data.metaDimensions ? { dimensions: data.metaDimensions } : {}),
        ...(data.metaWeight ? { weight: data.metaWeight } : {}),
      },
    };
    if (data.compareAtPrice !== undefined && data.compareAtPrice !== null && String(data.compareAtPrice) !== '') {
      payload.compareAtPrice = Number(data.compareAtPrice);
    }
    if (data.collectionHandle) {
      payload.collectionHandle = data.collectionHandle;
    }

    if (isEdit) {
      await updateProduct.mutateAsync({ id: slug!, data: payload });
    } else {
      await createProduct.mutateAsync(payload);
    }
    navigate('/products');
  };

  // ── Image reorder helpers ────────────────────────────────────────────────
  const moveImage = (from: number, to: number) => {
    setSelectedImages((imgs) => {
      const next = [...imgs];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  const removeImage = (idx: number) => {
    setSelectedImages((imgs) => imgs.filter((_, i) => i !== idx));
  };

  if (isEdit && loadingProduct) {
    return <div style={{ padding: 32, color: '#6b7280' }}>Loading product…</div>;
  }

  const isSaving = createProduct.isPending || updateProduct.isPending;

  return (
    <div style={{ maxWidth: 780 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button
          onClick={() => navigate('/products')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#374151' }}
          title="Back to products"
        >←</button>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
            {isEdit ? `Edit: ${product?.name ?? slug}` : 'New Product'}
          </h1>
          {isEdit && product?.slug && (
            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>slug: {product.slug}</div>
          )}
        </div>
        {isEdit && isDirty && (
          <span style={{ marginLeft: 'auto', fontSize: 12, color: '#f59e0b', fontWeight: 500 }}>Unsaved changes</span>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>

        {/* ── BASIC INFO ───────────────────────────────────────────────────── */}
        <Card title="Basic Info">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

            <Field label="Product Name" required error={errors.name ? 'Required' : undefined} full>
              <input
                {...register('name', { required: true })}
                style={inputStyle}
                placeholder="e.g. Brass Pooja Thali"
              />
            </Field>

            <Field label="SKU" required error={errors.sku ? 'Required' : undefined}>
              <input
                {...register('sku', { required: true })}
                style={inputStyle}
                placeholder="e.g. PTY-001"
              />
            </Field>

            <Field label="Category" required>
              <select {...register('category', { required: true })} style={inputStyle}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>

            <Field label="Collection" hint="Assigns product to a storefront collection">
              <select {...register('collectionHandle')} style={inputStyle}>
                <option value="">— none —</option>
                {collectionsData?.collections?.map((col) => (
                  <option key={col.handle} value={col.handle}>{col.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Tags" hint="Comma-separated, e.g. puja, gifting, brass" full>
              <input
                {...register('tags')}
                style={inputStyle}
                placeholder="puja, gifting, brass"
              />
            </Field>

            <Field label="Visibility" full>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginTop: 4 }}>
                <input type="checkbox" {...register('isActive')} />
                <span style={{ fontSize: 13 }}>Active — show this product in the storefront</span>
              </label>
            </Field>

          </div>
        </Card>

        {/* ── DESCRIPTION ──────────────────────────────────────────────────── */}
        <Card title="Description">
          <Field
            label="Description"
            required
            error={errors.description ? 'Required (min 20 characters)' : undefined}
          >
            <textarea
              {...register('description', { required: true, minLength: 20 })}
              rows={5}
              style={{ ...inputStyle, resize: 'vertical' }}
              placeholder="Hand-beaten by master artisans, this piece captures golden hour light in its textured finish…"
            />
          </Field>
        </Card>

        {/* ── PRICING & INVENTORY ──────────────────────────────────────────── */}
        <Card title="Pricing & Inventory">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>

            <Field label="Price (₹)" required error={errors.price ? 'Required' : undefined}>
              <input
                type="number"
                step="0.01"
                {...register('price', { required: true, min: 0 })}
                style={inputStyle}
              />
            </Field>

            <Field label="Compare-at Price (₹)" hint="Shown as strikethrough — leave blank to hide">
              <input
                type="number"
                step="0.01"
                {...register('compareAtPrice', { min: 0 })}
                style={inputStyle}
                placeholder="e.g. 2499"
              />
            </Field>

            <Field label="Stock Quantity" required error={errors.stock ? 'Required' : undefined}>
              <input
                type="number"
                {...register('stock', { required: true, min: 0 })}
                style={inputStyle}
              />
            </Field>

          </div>
        </Card>

        {/* ── PRODUCT DETAILS (metadata) ───────────────────────────────────── */}
        <Card title="Product Details">
          <p style={{ fontSize: 12, color: '#6b7280', marginTop: 0, marginBottom: 14 }}>
            These appear in the accordion sections on the product page: <em>Material &amp; Finish</em> and <em>Dimensions &amp; Weight</em>.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

            <Field label="Finish" hint='Shown as: "Finish: Polished"'>
              <input
                {...register('metaFinish')}
                style={inputStyle}
                placeholder="e.g. Polished, Antique, Natural"
              />
            </Field>

            <Field label="Usage" hint="Short usage note for the accordion">
              <input
                {...register('metaUsage')}
                style={inputStyle}
                placeholder="e.g. Suitable for daily puja use"
              />
            </Field>

            <Field label="Dimensions" hint='Shown as: "Dimensions: 12cm × 8cm × 3cm"'>
              <input
                {...register('metaDimensions')}
                style={inputStyle}
                placeholder="e.g. 12cm × 8cm × 3cm"
              />
            </Field>

            <Field label="Weight" hint='Shown as: "Weight: 350g"'>
              <input
                {...register('metaWeight')}
                style={inputStyle}
                placeholder="e.g. 350g"
              />
            </Field>

          </div>
        </Card>

        {/* ── IMAGES ───────────────────────────────────────────────────────── */}
        <Card title="Images">
          <p style={{ fontSize: 12, color: '#6b7280', marginTop: 0, marginBottom: 14 }}>
            The first image is used as the main cover image. Use ← → to reorder.
          </p>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
            {selectedImages.map((url, i) => (
              <div key={url + i} style={{ textAlign: 'center' }}>
                <img
                  src={url}
                  alt=""
                  style={{
                    width: 90, height: 90, objectFit: 'cover', borderRadius: 8, display: 'block',
                    border: i === 0 ? '2px solid #f59e0b' : '2px solid #e5e7eb',
                  }}
                />
                {i === 0 && (
                  <div style={{ fontSize: 9, fontWeight: 700, color: '#f59e0b', marginTop: 2 }}>COVER</div>
                )}
                <div style={{ display: 'flex', gap: 2, justifyContent: 'center', marginTop: 4 }}>
                  <button type="button" disabled={i === 0} onClick={() => moveImage(i, i - 1)} style={reorderBtnStyle} title="Move left">←</button>
                  <button type="button" disabled={i === selectedImages.length - 1} onClick={() => moveImage(i, i + 1)} style={reorderBtnStyle} title="Move right">→</button>
                  <button type="button" onClick={() => removeImage(i)} style={{ ...reorderBtnStyle, color: '#ef4444' }} title="Remove">✕</button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => setShowPicker(true)}
              style={{
                width: 90, height: 90, border: '2px dashed #d1d5db', borderRadius: 8,
                background: '#f9fafb', cursor: 'pointer', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 4, color: '#9ca3af', fontSize: 11,
              }}
            >
              <span style={{ fontSize: 22 }}>+</span>
              Add Image
            </button>
          </div>

          {selectedImages.length === 0 && (
            <div style={{ fontSize: 12, color: '#ef4444' }}>At least one image is required.</div>
          )}
        </Card>

        {/* ── SUBMIT ───────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', paddingBottom: 40 }}>
          <button
            type="submit"
            disabled={isSaving}
            style={{
              padding: '10px 28px', background: '#111827', color: '#fff',
              border: 'none', borderRadius: 6, cursor: isSaving ? 'not-allowed' : 'pointer',
              fontSize: 14, fontWeight: 500, opacity: isSaving ? 0.6 : 1,
            }}
          >
            {isSaving ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/products')}
            style={{
              padding: '10px 20px', background: 'transparent', color: '#374151',
              border: '1px solid #d1d5db', borderRadius: 6, cursor: 'pointer', fontSize: 14,
            }}
          >
            Cancel
          </button>
        </div>

      </form>

      {/* ── ASSET PICKER MODAL ───────────────────────────────────────────────── */}
      {showPicker && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{
            background: '#fff', borderRadius: 14, padding: 24,
            width: '80vw', maxWidth: 860, maxHeight: '80vh', overflow: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontWeight: 700, margin: 0 }}>Choose Image from Assets</h3>
                <p style={{ fontSize: 12, color: '#6b7280', margin: '4px 0 0' }}>Click an image to add it to the product. Already-added images are highlighted.</p>
              </div>
              <button
                onClick={() => setShowPicker(false)}
                style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#6b7280' }}
              >×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>
              {attachmentsData?.attachments?.map((att) => {
                const isSelected = selectedImages.includes(att.url);
                return (
                  <div
                    key={att._id}
                    onClick={() => {
                      if (!isSelected) setSelectedImages((imgs) => [...imgs, att.url]);
                      setShowPicker(false);
                    }}
                    style={{
                      cursor: isSelected ? 'default' : 'pointer',
                      border: isSelected ? '2px solid #f59e0b' : '2px solid #e5e7eb',
                      borderRadius: 8, overflow: 'hidden', opacity: isSelected ? 0.6 : 1,
                    }}
                    title={isSelected ? 'Already added' : att.originalName}
                  >
                    <img
                      src={att.url}
                      alt={att.originalName}
                      style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{ padding: '4px 6px', fontSize: 10, color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {att.originalName}
                    </div>
                  </div>
                );
              })}
              {!attachmentsData?.attachments?.length && (
                <p style={{ color: '#6b7280', fontSize: 13, gridColumn: '1/-1' }}>
                  No assets uploaded yet. Go to <strong>Attachments</strong> to upload images first.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid #d1d5db',
  borderRadius: 6,
  fontSize: 13,
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: '#374151',
  marginBottom: 4,
};

const reorderBtnStyle: React.CSSProperties = {
  background: '#f3f4f6',
  border: '1px solid #e5e7eb',
  borderRadius: 4,
  cursor: 'pointer',
  fontSize: 11,
  padding: '1px 5px',
  color: '#374151',
};

export default ProductFormPage;
