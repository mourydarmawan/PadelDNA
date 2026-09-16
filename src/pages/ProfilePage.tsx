import { useState, type FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Panel } from '@/components/ui/Panel';
import { Button } from '@/components/ui/Button';
import { SelectField, TextAreaField, TextField } from '@/components/ui/TextField';
import {
  DOMINANT_HAND_LABELS,
  PLAYER_LEVEL_LABELS,
  PLAYING_SIDE_LABELS,
  PLAYING_STYLE_LABELS,
  formatYearsPlaying,
} from '@/lib/labels';
import type { DominantHand, PlayerLevel, PlayingSide, PlayingStyle, Profile } from '@/types/database';

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function ProfilePage() {
  const { profile, user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!profile || !user) return null;

  return (
    <div className="px-5 sm:px-8 py-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Profile</h1>
          <p className="mt-1 text-[var(--color-mist-300)]">Your player identity, on and off the court.</p>
        </div>
        {!isEditing ? (
          <Button variant="secondary" onClick={() => setIsEditing(true)}>
            Edit profile
          </Button>
        ) : null}
      </div>

      <Panel>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-[var(--color-ink-700)] border border-[var(--color-ink-600)] flex items-center justify-center font-display text-xl font-bold text-[var(--color-court-400)]">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" className="h-full w-full rounded-full object-cover" />
            ) : (
              initials(profile.fullName)
            )}
          </div>
          <div>
            <p className="font-display text-xl font-semibold">{profile.fullName}</p>
            <p className="text-sm text-[var(--color-mist-400)]">@{profile.username ?? 'unset'}</p>
            <p className="text-sm text-[var(--color-mist-400)]">{user.email}</p>
          </div>
        </div>
      </Panel>

      {isEditing ? (
        <EditProfileForm
          profile={profile}
          onCancel={() => setIsEditing(false)}
          onSave={(patch) => {
            updateProfile(patch);
            setIsEditing(false);
          }}
        />
      ) : (
        <>
          <Panel title="Playing profile">
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 text-sm">
              <Field label="Level" value={profile.currentLevel ? PLAYER_LEVEL_LABELS[profile.currentLevel] : 'Not set'} />
              <Field label="Current rating" value={profile.currentRating?.toFixed(1) ?? 'Not set'} />
              <Field label="Experience" value={formatYearsPlaying(profile.yearsPlaying)} />
              <Field
                label="Preferred side"
                value={profile.preferredPosition ? PLAYING_SIDE_LABELS[profile.preferredPosition] : 'Not set'}
              />
              <Field
                label="Dominant hand"
                value={profile.dominantHand ? DOMINANT_HAND_LABELS[profile.dominantHand] : 'Not set'}
              />
              <Field
                label="Playing style"
                value={profile.primaryStyle ? PLAYING_STYLE_LABELS[profile.primaryStyle] : 'Not set'}
              />
              <Field
                label="Date of birth"
                value={profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not set'}
              />
            </dl>
          </Panel>

          <Panel title="Bio">
            <p className="text-[var(--color-mist-100)]">{profile.bio || 'No bio yet.'}</p>
          </Panel>

          <Panel title="Goals">
            <p className="text-[var(--color-mist-100)]">{profile.goals || 'No goals set yet.'}</p>
          </Panel>
        </>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wide text-[var(--color-mist-400)]">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}

interface EditProfileFormProps {
  profile: Profile;
  onSave: (patch: Partial<Profile>) => void;
  onCancel: () => void;
}

function EditProfileForm({ profile, onSave, onCancel }: EditProfileFormProps) {
  const [fullName, setFullName] = useState(profile.fullName);
  const [bio, setBio] = useState(profile.bio ?? '');
  const [goals, setGoals] = useState(profile.goals ?? '');
  const [currentLevel, setCurrentLevel] = useState<PlayerLevel | ''>(profile.currentLevel ?? '');
  const [preferredPosition, setPreferredPosition] = useState<PlayingSide | ''>(profile.preferredPosition ?? '');
  const [dominantHand, setDominantHand] = useState<DominantHand | ''>(profile.dominantHand ?? '');
  const [primaryStyle, setPrimaryStyle] = useState<PlayingStyle | ''>(profile.primaryStyle ?? '');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!fullName.trim()) {
      setError('Full name can\u2019t be empty.');
      return;
    }
    onSave({
      fullName: fullName.trim(),
      bio: bio.trim() || null,
      goals: goals.trim() || null,
      currentLevel: currentLevel || null,
      preferredPosition: preferredPosition || null,
      dominantHand: dominantHand || null,
      primaryStyle: primaryStyle || null,
    });
  }

  return (
    <Panel title="Edit profile">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <TextField label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} error={error ?? undefined} />

        <div className="grid sm:grid-cols-2 gap-5">
          <SelectField label="Playing level" value={currentLevel} onChange={(e) => setCurrentLevel(e.target.value as PlayerLevel)}>
            <option value="">Not set</option>
            {Object.entries(PLAYER_LEVEL_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectField>

          <SelectField
            label="Preferred side"
            value={preferredPosition}
            onChange={(e) => setPreferredPosition(e.target.value as PlayingSide)}
          >
            <option value="">Not set</option>
            {Object.entries(PLAYING_SIDE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectField>

          <SelectField label="Dominant hand" value={dominantHand} onChange={(e) => setDominantHand(e.target.value as DominantHand)}>
            <option value="">Not set</option>
            {Object.entries(DOMINANT_HAND_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectField>

          <SelectField label="Playing style" value={primaryStyle} onChange={(e) => setPrimaryStyle(e.target.value as PlayingStyle)}>
            <option value="">Not set</option>
            {Object.entries(PLAYING_STYLE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectField>
        </div>

        <TextAreaField label="Bio" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
        <TextAreaField label="Goals" rows={2} value={goals} onChange={(e) => setGoals(e.target.value)} />

        <div className="flex gap-3">
          <Button type="submit">Save changes</Button>
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Panel>
  );
}
