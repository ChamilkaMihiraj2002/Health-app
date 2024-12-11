<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // return parent::toArray($request);
        return [
            'id'=> $this->id,
            'Location'=> $this->Location,
            'Date'=> $this->Date,
            'Time'=> $this->Time,
            'description'=> $this->description,
            'doctor'=> $this->doctor,
            'userID'=> $this->userID,
            'created_at'=> $this->created_at,
        ];
    }
}
