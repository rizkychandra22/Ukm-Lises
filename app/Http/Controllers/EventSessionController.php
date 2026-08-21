<?php

namespace App\Http\Controllers;

use App\Models\EventSession;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use App\Services\Translations\GoogleTranslateService;

class EventSessionController extends Controller
{
    public function __construct(
        protected GoogleTranslateService $translator
    ) {}

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'event_id'          => ['required', 'exists:events,id'],
            'name_id'           => ['required', 'string', 'max:255'],
            'start_time'        => ['required'],
            'end_time'          => ['required'],
            'ticket_allocation' => ['required', 'integer', 'min:1'],
        ]);

        $validated['name_en'] = $this->translator->toEnglish($validated['name_id']) ?? $validated['name_id'];

        EventSession::create($validated);

        return back()->with('success', 'Sesi event berhasil ditambahkan.');
    }

    public function update(Request $request, EventSession $eventSession): RedirectResponse
    {
        $validated = $request->validate([
            'event_id'          => ['required', 'exists:events,id'],
            'name_id'           => ['required', 'string', 'max:255'],
            'start_time'        => ['required'],
            'end_time'          => ['required'],
            'ticket_allocation' => ['required', 'integer', 'min:1'],
        ]);

        $validated['name_en'] = $this->translator->toEnglish($validated['name_id']) ?? $validated['name_id'];

        $eventSession->update($validated);

        return back()->with('success', 'Sesi event berhasil diperbarui.');
    }

    public function destroy(EventSession $eventSession): RedirectResponse
    {
        $eventSession->delete();

        return back()->with('success', 'Sesi event berhasil dihapus.');
    }
}
